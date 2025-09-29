const express = require('express');
const { body, param, query } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { 
  getProperties, 
  getProperty, 
  createProperty, 
  updateProperty, 
  deleteProperty, 
  getUserProperties,
  verifyProperty 
} = require('../controllers/propertyController');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = './uploads/properties';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('نوع فایل مجاز نیست. فقط تصاویر و اسناد مجاز هستند.'));
    }
  }
});

// Validation rules
const createPropertyValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('عنوان باید بین 5 تا 200 کاراکتر باشد'),
  
  body('description')
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('توضیحات باید بین 20 تا 2000 کاراکتر باشد'),
  
  body('address')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('آدرس باید بین 10 تا 500 کاراکتر باشد'),
  
  body('city')
    .isIn(['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'اهواز', 'قم', 'کرمانشاه', 'ارومیه'])
    .withMessage('شهر انتخاب شده معتبر نیست'),
  
  body('property_type')
    .isIn(['آپارتمان', 'خانه', 'اداری', 'تجاری', 'صنعتی', 'زمین', 'ویلا'])
    .withMessage('نوع ملک انتخاب شده معتبر نیست'),
  
  body('area')
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('متراژ باید عدد مثبت باشد'),
  
  body('total_value')
    .isNumeric()
    .isFloat({ min: 1000000 })
    .withMessage('ارزش کل باید حداقل 1 میلیون ریال باشد'),
  
  body('total_tokens')
    .isInt({ min: 1 })
    .withMessage('تعداد توکن باید عدد صحیح مثبت باشد'),
  
  body('token_price')
    .optional()
    .isNumeric()
    .isFloat({ min: 10000 })
    .withMessage('قیمت توکن باید حداقل 10 هزار ریال باشد'),
  
  body('expected_annual_return')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('بازدهی سالانه باید بین 0 تا 100 درصد باشد'),
  
  body('rooms')
    .optional()
    .isInt({ min: 0 })
    .withMessage('تعداد اتاق نمی‌تواند منفی باشد'),
  
  body('floors')
    .optional()
    .isInt({ min: 1 })
    .withMessage('تعداد طبقه باید حداقل 1 باشد'),
  
  body('floor_number')
    .optional()
    .isInt({ min: 0 })
    .withMessage('شماره طبقه نمی‌تواند منفی باشد')
];

const updatePropertyValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه ملک نامعتبر است'),
  
  body('title')
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('عنوان باید بین 5 تا 200 کاراکتر باشد'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage('توضیحات باید بین 20 تا 2000 کاراکتر باشد'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('آدرس باید بین 10 تا 500 کاراکتر باشد'),
  
  body('city')
    .optional()
    .isIn(['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'اهواز', 'قم', 'کرمانشاه', 'ارومیه'])
    .withMessage('شهر انتخاب شده معتبر نیست'),
  
  body('property_type')
    .optional()
    .isIn(['آپارتمان', 'خانه', 'اداری', 'تجاری', 'صنعتی', 'زمین', 'ویلا'])
    .withMessage('نوع ملک انتخاب شده معتبر نیست'),
  
  body('area')
    .optional()
    .isNumeric()
    .isFloat({ min: 1 })
    .withMessage('متراژ باید عدد مثبت باشد'),
  
  body('total_value')
    .optional()
    .isNumeric()
    .isFloat({ min: 1000000 })
    .withMessage('ارزش کل باید حداقل 1 میلیون ریال باشد'),
  
  body('total_tokens')
    .optional()
    .isInt({ min: 1 })
    .withMessage('تعداد توکن باید عدد صحیح مثبت باشد'),
  
  body('token_price')
    .optional()
    .isNumeric()
    .isFloat({ min: 10000 })
    .withMessage('قیمت توکن باید حداقل 10 هزار ریال باشد'),
  
  body('expected_annual_return')
    .optional()
    .isNumeric()
    .isFloat({ min: 0, max: 100 })
    .withMessage('بازدهی سالانه باید بین 0 تا 100 درصد باشد')
];

const getPropertyValidation = [
  param('id')
    .isMongoId()
    .withMessage('شناسه ملک نامعتبر است')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('شماره صفحه باید عدد صحیح مثبت باشد'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('تعداد آیتم‌ها باید بین 1 تا 100 باشد'),
  
  query('city')
    .optional()
    .isIn(['تهران', 'مشهد', 'اصفهان', 'شیراز', 'تبریز', 'کرج', 'اهواز', 'قم', 'کرمانشاه', 'ارومیه'])
    .withMessage('شهر انتخاب شده معتبر نیست'),
  
  query('property_type')
    .optional()
    .isIn(['آپارتمان', 'خانه', 'اداری', 'تجاری', 'صنعتی', 'زمین', 'ویلا'])
    .withMessage('نوع ملک انتخاب شده معتبر نیست'),
  
  query('min_price')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداقل قیمت باید عدد مثبت باشد'),
  
  query('max_price')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر قیمت باید عدد مثبت باشد'),
  
  query('min_area')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداقل متراژ باید عدد مثبت باشد'),
  
  query('max_area')
    .optional()
    .isNumeric()
    .isFloat({ min: 0 })
    .withMessage('حداکثر متراژ باید عدد مثبت باشد'),
  
  query('status')
    .optional()
    .isIn(['در_حال_بررسی', 'تایید_شده', 'در_حال_فروش', 'فروخته_شده', 'رد_شده', 'تکمیل_شده'])
    .withMessage('وضعیت انتخاب شده معتبر نیست'),
  
  query('sort_by')
    .optional()
    .isIn(['created_at', 'total_value', 'token_price', 'area', 'views_count'])
    .withMessage('فیلد مرتب‌سازی نامعتبر است'),
  
  query('sort_order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('ترتیب مرتب‌سازی باید asc یا desc باشد')
];

// Routes
router.get('/', queryValidation, getProperties);
router.get('/my-properties', auth, getUserProperties);
router.get('/:id', getPropertyValidation, getProperty);
router.post('/', auth, createPropertyValidation, createProperty);
router.put('/:id', auth, updatePropertyValidation, updateProperty);
router.delete('/:id', auth, getPropertyValidation, deleteProperty);

// Admin routes
router.put('/:id/verify', auth, authorize('admin'), getPropertyValidation, verifyProperty);

// File upload routes
router.post('/:id/images', auth, upload.array('images', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'ملک یافت نشد'
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'شما مجوز آپلود تصویر برای این ملک را ندارید'
      });
    }

    // Add uploaded images
    const uploadedImages = req.files.map(file => ({
      url: `/uploads/properties/${file.filename}`,
      alt_text: file.originalname,
      uploaded_at: new Date()
    }));

    property.images.push(...uploadedImages);
    await property.save();

    res.json({
      success: true,
      message: 'تصاویر با موفقیت آپلود شدند',
      data: { images: uploadedImages }
    });

  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({
      success: false,
      message: 'خطا در آپلود تصاویر',
      error: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
});

module.exports = router;
