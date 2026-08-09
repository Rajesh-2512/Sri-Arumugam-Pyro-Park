-- ==========================================
-- SQL Migration Script: Add Missing Columns to Orders Table
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==========================================

-- 1. Add Aadhar/PAN, Paid Amount, Remaining Balance, and Device ID columns
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS aadhar_pan TEXT,
ADD COLUMN IF NOT EXISTS paid_amount NUMERIC,
ADD COLUMN IF NOT EXISTS remaining_amount NUMERIC,
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- 2. Optional: Index for device_id & aadhar_pan search speed
CREATE INDEX IF NOT EXISTS idx_orders_aadhar_pan ON public.orders(aadhar_pan);
CREATE INDEX IF NOT EXISTS idx_orders_device_id ON public.orders(device_id);
