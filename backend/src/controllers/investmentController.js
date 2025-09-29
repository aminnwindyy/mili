const { validationResult } = require('express-validator');
const Investment = require('../models/Investment');
const Property = require('../models/Property');
const User = require('../models/User');
const { sanitizeInput, calculateReturn } = require('../utils/helpers');

// Get all investments with filters
const getInvestments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      investor,
      property,
      status,
      payment_status,
      min_amount,
      max_amount,
      date_from,
      date_to,
      is_listed_for_sale,
      sort_by = 'investment_date',
      sort_order = 'desc'
    } = req.query;

    // Build filter object
    const filters = {};
    if (investor) filters.investor = investor;
    if (property) filters.property = property;
    if (status) filters.status = status;
    if (payment_status) filters.payment_status = payment_status;
    if (min_amount) filters.min_amount = parseInt(min_amount);
    if (max_amount) filters.max_amount = parseInt(max_amount);
    if (date_from) filters.date_from = date_from;
    if (date_to) filters.date_to = date_to;
    if (is_listed_for_sale !== undefined) {
      filters.is_listed_for_sale = is_listed_for_sale === 'true';
    }

    // Build sort object
    const sort = {};
    sort[sort_by] = sort_order === 'desc' ? -1 : 1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query
    const investments = await Investment.findByFilters(filters)
      .populate('investor', 'full_name email')
      .populate('property', 'title address city property_type')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count for pagination
    const total = await Investment.findByFilters(filters).countDocuments();

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get investments error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت لیست سرمایه‌گذاری‌ها',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get single investment by ID
const getInvestment = async (req, res) => {
  try {
    const { id } = req.params;

    const investment = await Investment.findById(id)
      .populate('investor', 'full_name email phone')
      .populate('property', 'title address city property_type total_value token_price')
      .populate('created_by', 'full_name')
      .populate('approved_by', 'full_name');

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'سرمایه‌گذاری یافت نشد'
      });
    }

    res.json({
      success: true,
      data: { investment }
    });

  } catch (error) {
    console.error('Get investment error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت اطلاعات سرمایه‌گذاری',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Create new investment
const createInvestment = async (req, res) => {
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
      property_id,
      investment_amount,
      tokens_purchased,
      payment_method,
      payment_reference,
      notes
    } = req.body;

    // Verify property exists and is available
    const property = await Property.findById(property_id);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    if (property.status !== 'در_حال_فروش') {
      return res.status(400).json({
        success: false,
        message: 'این ملک در حال حاضر برای سرمایه‌گذاری در دسترس نیست'
      });
    }

    if (property.available_tokens < tokens_purchased) {
      return res.status(400).json({
        success: false,
        message: `تعداد توکن‌های موجود: ${property.available_tokens}، درخواست شده: ${tokens_purchased}`
      });
    }

    // Calculate token price
    const token_price_at_purchase = property.token_price;
    const calculated_amount = tokens_purchased * token_price_at_purchase;

    if (Math.abs(calculated_amount - investment_amount) > 1000) { // Allow 1000 Rial difference
      return res.status(400).json({
        success: false,
        message: `مبلغ محاسبه شده: ${calculated_amount.toLocaleString('fa-IR')} ریال، مبلغ وارد شده: ${investment_amount.toLocaleString('fa-IR')} ریال`
      });
    }

    // Create investment
    const investmentData = {
      investor: req.user.id,
      investor_email: req.user.email,
      investor_name: req.user.full_name,
      property: property_id,
      property_title: property.title,
      property_address: property.address,
      investment_amount: calculated_amount,
      tokens_purchased,
      token_price_at_purchase,
      payment_method,
      payment_reference: payment_reference || '',
      expected_annual_return: property.expected_annual_return,
      risk_level: property.risk_level || 'medium',
      notes: sanitizeInput(notes) || '',
      created_by: req.user.id
    };

    const investment = new Investment(investmentData);
    await investment.save();

    // Update property available tokens
    property.available_tokens -= tokens_purchased;
    if (property.available_tokens === 0) {
      property.status = 'فروخته_شده';
    }
    await property.save();

    // Populate related data
    await investment.populate([
      { path: 'investor', select: 'full_name email' },
      { path: 'property', select: 'title address city property_type' }
    ]);

    res.status(201).json({
      success: true,
      message: 'سرمایه‌گذاری با موفقیت ثبت شد',
      data: { investment }
    });

  } catch (error) {
    console.error('Create investment error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در ثبت سرمایه‌گذاری',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Update investment
const updateInvestment = async (req, res) => {
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
    const investment = await Investment.findById(id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'سرمایه‌گذاری یافت نشد'
      });
    }

    // Check ownership or admin access
    if (investment.investor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز ویرایش این سرمایه‌گذاری را ندارید'
      });
    }

    // Sanitize text inputs
    const updateData = { ...req.body };
    if (updateData.notes) updateData.notes = sanitizeInput(updateData.notes);
    if (updateData.compliance_notes) {
      updateData.compliance_notes = sanitizeInput(updateData.compliance_notes);
    }

    // Update investment
    Object.assign(investment, updateData);
    await investment.save();

    // Populate related data
    await investment.populate([
      { path: 'investor', select: 'full_name email' },
      { path: 'property', select: 'title address city property_type' }
    ]);

    res.json({
      success: true,
      message: 'سرمایه‌گذاری با موفقیت به‌روزرسانی شد',
      data: { investment }
    });

  } catch (error) {
    console.error('Update investment error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در به‌روزرسانی سرمایه‌گذاری',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get user's investments (portfolio)
const getUserInvestments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const filters = { investor: req.user.id };
    if (status) filters.status = status;

    const investments = await Investment.findByFilters(filters)
      .populate('property', 'title address city property_type images')
      .sort({ investment_date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Investment.findByFilters(filters).countDocuments();

    // Get portfolio statistics
    const portfolioStats = await Investment.getPortfolioStats(req.user.id);

    res.json({
      success: true,
      data: {
        investments,
        portfolio_stats: portfolioStats,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user investments error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت سرمایه‌گذاری‌های شما',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Cancel investment
const cancelInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await Investment.findById(id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'سرمایه‌گذاری یافت نشد'
      });
    }

    // Check ownership
    if (investment.investor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز لغو این سرمایه‌گذاری را ندارید'
      });
    }

    // Check if investment can be cancelled
    if (investment.status !== 'pending' && investment.status !== 'confirmed') {
      return res.status(400).json({
        success: false,
        message: 'این سرمایه‌گذاری قابل لغو نیست'
      });
    }

    // Update investment status
    investment.status = 'cancelled';
    await investment.save();

    // Return tokens to property
    const property = await Property.findById(investment.property);
    if (property) {
      property.available_tokens += investment.tokens_purchased;
      if (property.status === 'فروخته_شده') {
        property.status = 'در_حال_فروش';
      }
      await property.save();
    }

    res.json({
      success: true,
      message: 'سرمایه‌گذاری با موفقیت لغو شد',
      data: { investment }
    });

  } catch (error) {
    console.error('Cancel investment error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در لغو سرمایه‌گذاری',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// List investment for sale (secondary market)
const listForSale = async (req, res) => {
  try {
    const { id } = req.params;
    const { sale_price } = req.body;

    const investment = await Investment.findById(id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'سرمایه‌گذاری یافت نشد'
      });
    }

    // Check ownership
    if (investment.investor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز فروش این سرمایه‌گذاری را ندارید'
      });
    }

    // Check if investment is active
    if (investment.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'فقط سرمایه‌گذاری‌های فعال قابل فروش هستند'
      });
    }

    // Update investment
    investment.is_listed_for_sale = true;
    investment.sale_price = sale_price || investment.current_value;
    investment.sale_listing_date = new Date();
    await investment.save();

    res.json({
      success: true,
      message: 'سرمایه‌گذاری برای فروش قرار گرفت',
      data: { investment }
    });

  } catch (error) {
    console.error('List for sale error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در قرار دادن برای فروش',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Remove from sale listing
const removeFromSale = async (req, res) => {
  try {
    const { id } = req.params;
    const investment = await Investment.findById(id);

    if (!investment) {
      return res.status(404).json({
        success: false,
        message: 'سرمایه‌گذاری یافت نشد'
      });
    }

    // Check ownership
    if (investment.investor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز حذف این سرمایه‌گذاری از فروش را ندارید'
      });
    }

    // Update investment
    investment.is_listed_for_sale = false;
    investment.sale_price = undefined;
    investment.sale_listing_date = undefined;
    await investment.save();

    res.json({
      success: true,
      message: 'سرمایه‌گذاری از فروش حذف شد',
      data: { investment }
    });

  } catch (error) {
    console.error('Remove from sale error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در حذف از فروش',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

// Get secondary market listings
const getSecondaryMarket = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const investments = await Investment.findByFilters({ is_listed_for_sale: true })
      .populate('investor', 'full_name')
      .populate('property', 'title address city property_type images')
      .sort({ sale_listing_date: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Investment.findByFilters({ is_listed_for_sale: true }).countDocuments();

    res.json({
      success: true,
      data: {
        investments,
        pagination: {
          current_page: parseInt(page),
          total_pages: Math.ceil(total / parseInt(limit)),
          total_items: total,
          items_per_page: parseInt(limit)
        }
      }
    });

  } catch (error) {
    console.error('Get secondary market error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در دریافت بازار ثانویه',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = {
  getInvestments,
  getInvestment,
  createInvestment,
  updateInvestment,
  getUserInvestments,
  cancelInvestment,
  listForSale,
  removeFromSale,
  getSecondaryMarket
};
