const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const User = require('../models/User');
const { sanitizeInput } = require('../utils/helpers');

// Get all properties with filters
const getProperties = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      city,
      property_type,
      min_price,
      max_price,
      min_area,
      max_area,
      status,
      search,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    if (city) filters.city = city;
    if (property_type) filters.property_type = property_type;
    if (min_price) filters.min_price = parseInt(min_price);
    if (max_price) filters.max_price = parseInt(max_price);
    if (min_area) filters.min_area = parseInt(min_area);
    if (max_area) filters.max_area = parseInt(max_area);
    if (status) filters.status = status;
    if (search) filters.search = sanitizeInput(search);

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const properties = await Property.findByFilters(filters)
      .populate('owner', 'full_name email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Property.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست املاک',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get single property by ID
const getProperty = async (req, res) => {
  try {
    const { id } = req.params;

    const property = await Property.findById(id)
      .populate('owner', 'full_name email phone')
      .populate('verified_by', 'full_name');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    // Increment view count
    property.views_count += 1;
    await property.save();

    res.json({
      success: true,
      data: { property }
    });

  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات ملک',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Create new property
const createProperty = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'اطلاعات ورودی صحیح نیست',
        errors: errors.array()
      });
    }

    const propertyData = {
      ...req.body,
      owner: req.user.id,
      owner_name: req.user.full_name || req.body.owner_name,
      owner_contact: req.user.phone || req.body.owner_contact
    };

    // Sanitize text inputs
    if (propertyData.title) propertyData.title = sanitizeInput(propertyData.title);
    if (propertyData.description) propertyData.description = sanitizeInput(propertyData.description);
    if (propertyData.address) propertyData.address = sanitizeInput(propertyData.address);

    const property = new Property(propertyData);
    await property.save();

    // Populate owner info
    await property.populate('owner', 'full_name email');

    res.status(201).json({
      success: true,
      message: 'ملک با موفقیت ثبت شد',
      data: { property }
    });

  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت ملک',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Update property
const updateProperty = async (req, res) => {
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
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    // Check ownership or admin access
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز ویرایش این ملک را ندارید'
      });
    }

    // Sanitize text inputs
    const updateData = { ...req.body };
    if (updateData.title) updateData.title = sanitizeInput(updateData.title);
    if (updateData.description) updateData.description = sanitizeInput(updateData.description);
    if (updateData.address) updateData.address = sanitizeInput(updateData.address);

    // Update property
    Object.assign(property, updateData);
    await property.save();

    // Populate owner info
    await property.populate('owner', 'full_name email');

    res.json({
      success: true,
      message: 'ملک با موفقیت به‌روزرسانی شد',
      data: { property }
    });

  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی ملک',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Delete property
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    // Check ownership or admin access
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز حذف این ملک را ندارید'
      });
    }

    await Property.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'ملک با موفقیت حذف شد'
    });

  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف ملک',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get user's properties
const getUserProperties = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const properties = await Property.find({ owner: req.user.id })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Property.countDocuments({ owner: req.user.id });

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user properties error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت املاک شما',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Verify property (admin only)
const verifyProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    const property = await Property.findById(id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    property.is_verified = is_verified;
    property.verified_at = is_verified ? new Date() : null;
    property.verified_by = is_verified ? req.user.id : null;

    await property.save();

    res.json({
      success: true,
      message: is_verified ? 'ملک تایید شد' : 'تایید ملک لغو شد',
      data: { property }
    });

  } catch (error) {
    console.error('Verify property error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در تایید ملک',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  getProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
  getUserProperties,
  verifyProperty
};
