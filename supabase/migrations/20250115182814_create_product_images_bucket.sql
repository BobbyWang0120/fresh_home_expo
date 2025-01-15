-- Create a new storage bucket for product images
insert into storage.buckets (id, name, public, avif_autodetection)
values ('product-images', 'product-images', true, false);

-- Set up security policies for the bucket
create policy "Public Access to Product Images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Only authenticated suppliers can upload images
create policy "Suppliers can upload product images"
  on storage.objects for insert
  with check (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'supplier'
    )
  );

-- Suppliers can only update/delete their own images
create policy "Suppliers can update their own images"
  on storage.objects for update
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and owner = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'supplier'
    )
  );

create policy "Suppliers can delete their own images"
  on storage.objects for delete
  using (
    bucket_id = 'product-images'
    and auth.role() = 'authenticated'
    and owner = auth.uid()
    and exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'supplier'
    )
  );