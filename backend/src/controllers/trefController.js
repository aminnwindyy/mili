const { validationResult } = require('express-validator');
const TREF = require('../models/TREF');
const Property = require('../models/Property');
const User = require('../models/User');
const { sanitizeInput, generateRandomString } = require('../utils/helpers');

// Get all TREFs with filters
const getTREFs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      fund_type,
      category,
      status,
      risk_level,
      min_return,
      max_return,
      min_investment,
      max_investment,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    if (fund_type) filters.fund_type = fund_type;
    if (category) filters.category = category;
    if (status) filters.status = status;
    if (risk_level) filters.risk_level = risk_level;
    if (min_return) filters.min_return = parseFloat(min_return);
    if (max_return) filters.max_return = parseFloat(max_return);
    if (min_investment) filters.min_investment = parseInt(min_investment);
    if (max_investment) filters.max_investment = parseInt(max_investment);
    if (search) filters.search = sanitizeInput(search);

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const trefs = await TREF.findByFilters(filters)
      .populate('fund_manager', 'full_name email')
      .populate('properties.property', 'title address city property_type')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await TREF.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        trefs,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get TREFs error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست صندوق‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get single TREF by ID
const getTREF = async (req, res) => {
  try {
    const { id } = req.params;

    const tref = await TREF.findById(id)
      .populate('fund_manager', 'full_name email phone')
      .populate('properties.property', 'title address city property_type images')
      .populate('created_by', 'full_name')
      .populate('approved_by', 'full_name');

    if (!tref) {
      return res.status(404).json({
        success: false,
        message: 'صندوق یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { tref }
    });

  } catch (error) {
    console.error('Get TREF error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Create new TREF
const createTREF = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const {
      name,
      description,
      fund_type,
      category,
      total_fund_size,
      total_shares,
      expected_annual_return,
      management_fee,
      performance_fee,
      entry_fee,
      exit_fee,
      risk_level,
      distribution_frequency,
      properties,
      notes
    } = req.body;

    // Generate unique fund code
    const fund_code = `TREF${generateRandomString(6).toUpperCase()}`;

    // Verify all properties exist
    if (properties && properties.length > 0) {
      const propertyIds = properties.map(p => p.property);
      const existingProperties = await Property.find({ _id: { $in: propertyIds } });
      
      if (existingProperties.length !== propertyIds.length) {
        return res.status(400).json({
          success: false,
          message: 'برخی از املاک یافت نشدند'
        });
      }
    }

    // Create TREF
    const trefData = {
      name: sanitizeInput(name),
      description: sanitizeInput(description),
      fund_code,
      fund_type,
      category,
      fund_manager: req.user.id,
      fund_manager_name: req.user.full_name,
      fund_manager_contact: req.user.phone || '',
      total_fund_size,
      total_shares,
      expected_annual_return,
      management_fee,
      performance_fee,
      entry_fee,
      exit_fee,
      risk_level,
      distribution_frequency,
      properties: properties || [],
      notes: sanitizeInput(notes) || '',
      created_by: req.user.id
    };

    const tref = new TREF(trefData);
    await tref.save();

    // Populate related data
    await tref.populate([
      { path: 'fund_manager', select: 'full_name email' },
      { path: 'properties.property', select: 'title address city property_type' }
    ]);

    res.status(201).json({
      success: true,
      message: 'صندوق با موفقیت ایجاد شد',
      data: { tref }
    });

  } catch (error) {
    console.error('Create TREF error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ایجاد صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Update TREF
const updateTREF = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const tref = await TREF.findById(id);

    if (!tref) {
      return res.status(404).json({
        success: false,
        message: 'صندوق یافت نشد'
      });
    }

    // Check ownership or admin access
    if (tref.fund_manager.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز ویرایش این صندوق را ندارید'
      });
    }

    // Sanitize text inputs
    const updateData = { ...req.body };
    if (updateData.name) updateData.name = sanitizeInput(updateData.name);
    if (updateData.description) updateData.description = sanitizeInput(updateData.description);
    if (updateData.notes) updateData.notes = sanitizeInput(updateData.notes);

    // Update TREF
    Object.assign(tref, updateData);
    await tref.save();

    // Populate related data
    await tref.populate([
      { path: 'fund_manager', select: 'full_name email' },
      { path: 'properties.property', select: 'title address city property_type' }
    ]);

    res.json({
      success: true,
      message: 'صندوق با موفقیت به‌روزرسانی شد',
      data: { tref }
    });

  } catch (error) {
    console.error('Update TREF error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get TREF performance statistics
const getTREFPerformance = async (req, res) => {
  try {
    const { id } = req.params;
    const tref = await TREF.findById(id);

    if (!tref) {
      return res.status(404).json({
        success: false,
        message: 'صندوق یافت نشد'
      });
    }

    // Calculate performance metrics
    const performance = {
      fund_performance: tref.fund_performance,
      performance_metrics: tref.performance_metrics,
      risk_assessment: {
        risk_level: tref.risk_level,
        risk_score: tref.risk_score,
        risk_factors: tref.risk_factors
      },
      fund_statistics: {
        total_investors: tref.total_investors,
        total_investments: tref.total_investments,
        average_investment: tref.average_investment,
        total_shares: tref.total_shares,
        available_shares: tref.available_shares
      }
    };

    res.json({
      success: true,
      data: { performance }
    });

  } catch (error) {
    console.error('Get TREF performance error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار عملکرد صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get TREF properties
const getTREFProperties = async (req, res) => {
  try {
    const { id } = req.params;
    const tref = await TREF.findById(id)
      .populate('properties.property', 'title address city property_type area total_value images');

    if (!tref) {
      return res.status(404).json({
        success: false,
        message: 'صندوق یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { properties: tref.properties }
    });

  } catch (error) {
    console.error('Get TREF properties error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت املاک صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Add property to TREF
const addPropertyToTREF = async (req, res) => {
  try {
    const { id } = req.params;
    const { property_id, property_value, ownership_percentage } = req.body;

    const tref = await TREF.findById(id);
    if (!tref) {
      return res.status(404).json({
        success: false,
        message: 'صندوق یافت نشد'
      });
    }

    // Check ownership or admin access
    if (tref.fund_manager.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز اضافه کردن ملک به این صندوق را ندارید'
      });
    }

    // Verify property exists
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    // Check if property is already in the fund
    const existingProperty = tref.properties.find(p => p.property.toString() === property_id);
    if (existingProperty) {
      return res.status(400).json({
        success: false,
        message: 'این ملک قبلاً در صندوق اضافه شده است'
      });
    }

    // Add property to TREF
    const newProperty = {
      property: property_id,
      property_title: property.title,
      property_address: property.address,
      property_value,
      ownership_percentage,
      acquisition_date: new Date()
    };

    tref.properties.push(newProperty);
    await tref.save();

    // Populate the new property
    await newProperty.populate('property', 'title address city property_type');

    res.json({
      success: true,
      message: 'ملک با موفقیت به صندوق اضافه شد',
      data: { property: newProperty }
    });

  } catch (error) {
    console.error('Add property to TREF error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در اضافه کردن ملک به صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Remove property from TREF
const removePropertyFromTREF = async (req, res) => {
  try {
    const { id, property_id } = req.params;

    const tref = await TREF.findById(id);
    if (!tref) {
      return res.status(404).json({
        success: false,
        message: 'صندوق یافت نشد'
      });
    }

    // Check ownership or admin access
    if (tref.fund_manager.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز حذف ملک از این صندوق را ندارید'
      });
    }

    // Find and remove property
    const propertyIndex = tref.properties.findIndex(p => p.property.toString() === property_id);
    if (propertyIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'ملک در صندوق یافت نشد'
      });
    }

    tref.properties.splice(propertyIndex, 1);
    await tref.save();

    res.json({
      success: true,
      message: 'ملک با موفقیت از صندوق حذف شد'
    });

  } catch (error) {
    console.error('Remove property from TREF error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف ملک از صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get TREF market statistics
const getTREFMarketStats = async (req, res) => {
  try {
    const stats = await TREF.getPerformanceStats();

    res.json({
      success: true,
      data: { stats }
    });

  } catch (error) {
    console.error('Get TREF market stats error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت آمار بازار صندوق‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Launch TREF
const launchTREF = async (req, res) => {
  try {
    const { id } = req.params;
    const tref = await TREF.findById(id);

    if (!tref) {
      return res.status(404).json({
        success: false,
        message: 'صندوق یافت نشد'
      });
    }

    // Check ownership or admin access
    if (tref.fund_manager.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز راه‌اندازی این صندوق را ندارید'
      });
    }

    // Check if TREF can be launched
    if (tref.status !== 'planning' && tref.status !== 'launching') {
      return res.status(400).json({
        success: false,
        message: 'این صندوق قابل راه‌اندازی نیست'
      });
    }

    // Update TREF status
    tref.status = 'active';
    tref.launch_date = new Date();
    await tref.save();

    res.json({
      success: true,
      message: 'صندوق با موفقیت راه‌اندازی شد',
      data: { tref }
    });

  } catch (error) {
    console.error('Launch TREF error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در راه‌اندازی صندوق',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  getTREFs,
  getTREF,
  createTREF,
  updateTREF,
  getTREFPerformance,
  getTREFProperties,
  addPropertyToTREF,
  removePropertyFromTREF,
  getTREFMarketStats,
  launchTREF
};
