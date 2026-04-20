import Transporter from "../../models/admin/TransporterConfig.js";
import AppError from "../../utils/AppError.js";
import asyncHandler from "../../utils/asyncHandler.js";

export const addTransporter = asyncHandler(async (req, res) => {
  let {
    transporterName,
    registrationNumber,
    trackingUrl,
    contactDetails,
    isActive,
  } = req.body;

  // check contact details type must be object
  if (typeof contactDetails === "string") {
    contactDetails = JSON.parse(contactDetails);
  }

  // find existing transporter if exists
  const existing = await Transporter.findOne({
    registrationNumber,
    status: { $ne: "inactive" },
  });

  if (existing) {
    throw AppError.conflict("Transporter already exists", "ALREADY_EXISTS");
  }

  // create new transporter if not exists
  const transporter = await Transporter.create({
    transporterName,
    registrationNumber,
    trackingUrl,
    contactDetails,
    isActive: isActive === undefined ? true : isActive,
  });

  res.status(201).json({
    success: true,
    message: "Transporter added successfully",
    transporter,
  });
});

export const getTransporters = asyncHandler(async (req, res) => {
  const { search, page = 1, limit = 10, status, sortBy } = req.query;

  const query = {};

  //   pagination
  const skip = (page - 1) * limit;

  // search filter by name and registation id
  if (search) {
    query.$or = [
      { transporterName: { $regex: search, $options: "i" } },
      { registrationNumber: { $regex: search, $options: "i" } },
    ];
  }

  // filter by status - active/inactive
  if (status === "active") query.isActive = true;
  if (status === "inactive") query.isActive = false;

  // sort by latest oldest az and za
  const sort = {};
  if (sortBy === "latest") sort.createdAt = -1;
  if (sortBy === "oldest") sort.createdAt = 1;
  if (sortBy === "az") sort.transporterName = 1;
  if (sortBy === "za") sort.transporterName = -1;

  const transporters = await Transporter.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Transporter.countDocuments(query);

  res.status(200).json({
    success: true,
    message: "Transporters fetched successfully",
    data: transporters,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

export const updateTransporter = asyncHandler(async (req, res) => {
  const { transporterId } = req.params;
  const { transporterName, trackingUrl, contactDetails } = req.body;

  const transporter = await Transporter.findById(transporterId);

  if (!transporter) {
    throw AppError.notFound("Transporter not found", "NOT_FOUND");
  }

  if (transporterName !== undefined)
    transporter.transporterName = transporterName;
  if (trackingUrl !== undefined) transporter.trackingUrl = trackingUrl;
  if (contactDetails !== undefined) transporter.contactDetails = contactDetails;

  await transporter.save();

  res.status(200).json({
    success: true,
    message: "Transporter updated successfully",
    transporter,
  });
});

export const toggleTransporter = asyncHandler(async (req, res) => {
  const { transporterId } = req.params;

  const transporter = await Transporter.findById(transporterId);

  if (!transporter) {
    throw AppError.notFound("Transporter not found", "NOT_FOUND");
  }
  transporter.isActive = !transporter.isActive;
  await transporter.save();

  res.status(200).json({
    success: true,
    message: `Transporter ${transporter.isActive ? "activated" : "deactivated"}  successfully`,
  });
});

export const getTransporterDetails = asyncHandler(async (req, res) => {
  const { transporterId } = req.params;

  const transporter = await Transporter.findById(transporterId).lean();

  if (!transporter) {
    throw AppError.notFound("Transporter not found", "NOT_FOUND");
  }

  res.status(200).json({
    success: true,
    message: "Transporter fetched successfully",
    transporter,
  });
});
