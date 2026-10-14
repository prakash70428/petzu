/**
 * Booking requests are stored as ENQUIRY feedback whose subject starts with
 * this (see features/services/components/booking/booking-flow.tsx), so the
 * admin can tell them apart from general enquiries.
 */
export const BOOKING_SUBJECT_PREFIX = "Booking request";
