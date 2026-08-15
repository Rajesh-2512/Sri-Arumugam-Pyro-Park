-- Migration SQL for GST Audit Bills Table in Supabase
CREATE TABLE IF NOT EXISTS public.gst_audit_bills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bill_number TEXT NOT NULL UNIQUE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  pincode TEXT,
  state TEXT DEFAULT 'Tamil Nadu',
  gstin_aadhar TEXT,
  particulars TEXT DEFAULT 'Assorted Crackers Variety Pack (HSN 3604)',
  total_amount NUMERIC NOT NULL,
  taxable_amount NUMERIC NOT NULL,
  gst_amount NUMERIC NOT NULL,
  cgst NUMERIC DEFAULT 0,
  sgst NUMERIC DEFAULT 0,
  igst NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS & set public/authenticated policies
ALTER TABLE public.gst_audit_bills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to gst_audit_bills" ON public.gst_audit_bills
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated service role full access to gst_audit_bills" ON public.gst_audit_bills
  FOR ALL USING (true);
