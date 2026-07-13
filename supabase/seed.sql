-- Local/demo seed. Password for seeded users: padua-demo
-- Never run this file against a production project.

insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at, confirmation_token, recovery_token
) values
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'olivia@example.com', crypt('padua-demo', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Olivia Rivera"}', now(), now(), '', ''),
  ('00000000-0000-0000-0000-000000000000', '10000000-0000-0000-0000-000000000002', 'authenticated', 'authenticated', 'marcus@example.com', crypt('padua-demo', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Marcus Bennett"}', now(), now(), '', ''),
  ('00000000-0000-0000-0000-000000000000', '20000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'claire@paduaweddings.com', crypt('padua-demo', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Claire Bennett"}', now(), now(), '', ''),
  ('00000000-0000-0000-0000-000000000000', '30000000-0000-0000-0000-000000000001', 'authenticated', 'authenticated', 'admin@paduaweddings.com', crypt('padua-demo', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Padua Administrator"}', now(), now(), '', '')
on conflict (id) do nothing;

insert into auth.identities (
  provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) values
  ('olivia@example.com', '10000000-0000-0000-0000-000000000001', '{"sub":"10000000-0000-0000-0000-000000000001","email":"olivia@example.com"}', 'email', now(), now(), now()),
  ('marcus@example.com', '10000000-0000-0000-0000-000000000002', '{"sub":"10000000-0000-0000-0000-000000000002","email":"marcus@example.com"}', 'email', now(), now(), now()),
  ('claire@paduaweddings.com', '20000000-0000-0000-0000-000000000001', '{"sub":"20000000-0000-0000-0000-000000000001","email":"claire@paduaweddings.com"}', 'email', now(), now(), now()),
  ('admin@paduaweddings.com', '30000000-0000-0000-0000-000000000001', '{"sub":"30000000-0000-0000-0000-000000000001","email":"admin@paduaweddings.com"}', 'email', now(), now(), now())
on conflict (provider_id, provider) do nothing;

update public.profiles set role = 'staff', phone = '(909) 555-0188'
where id = '20000000-0000-0000-0000-000000000001';
update public.profiles set role = 'administrator'
where id = '30000000-0000-0000-0000-000000000001';

insert into public.weddings (
  id, couple_names, wedding_date, date_precision, guest_count, target_budget,
  booking_status, planning_stage, ceremony_preference, reception_preference,
  priorities, coordinator_id, created_by
) values (
  '40000000-0000-0000-0000-000000000001',
  'Olivia & Marcus',
  '2027-10-17',
  'exact',
  150,
  85000,
  'booked',
  'vendors_booked',
  'Outdoor courtyard',
  'Seated dinner and dancing',
  array['Guest experience', 'Photography', 'Food'],
  '20000000-0000-0000-0000-000000000001',
  '10000000-0000-0000-0000-000000000001'
) on conflict (id) do nothing;

insert into public.wedding_members (wedding_id, user_id, member_role, assigned_by) values
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'owner', '30000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000002', 'partner', '10000000-0000-0000-0000-000000000001'),
  ('40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'coordinator', '30000000-0000-0000-0000-000000000001')
on conflict do nothing;

insert into public.checklist_tasks (
  id, wedding_id, title, description, due_date, category, priority, status,
  notes, sort_order, completed_at, created_by
) values
  ('50000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Book Padua', 'Review the agreement and reserve the wedding date.', '2026-04-10', 'Venue', 1, 'completed', null, 10, '2026-04-02', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'Set target budget', 'Agree on total investment and category priorities.', '2026-05-02', 'Budget', 1, 'completed', null, 20, '2026-04-28', '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'Confirm photographer', 'Review coverage hours and sign the final agreement.', '2026-08-02', 'Photography', 1, 'in_progress', 'Ask about analog film coverage.', 30, null, '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'Draft guest list', 'Consolidate both household lists and confirm addresses.', '2026-08-18', 'Guest List', 1, 'in_progress', null, 40, null, '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'Select planning team', 'Interview the final two planning partners.', '2026-09-01', 'Vendors', 2, 'not_started', null, 50, null, '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000006', '40000000-0000-0000-0000-000000000001', 'Save ceremony references', 'Collect processional and floral references for the courtyard.', '2026-09-14', 'Ceremony', 3, 'not_started', null, 60, null, '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000007', '40000000-0000-0000-0000-000000000001', 'Explore catering direction', 'Collect dietary needs and questions for menu planning.', '2026-10-12', 'Catering', 2, 'waiting', null, 70, null, '10000000-0000-0000-0000-000000000001'),
  ('50000000-0000-0000-0000-000000000008', '40000000-0000-0000-0000-000000000001', 'Research entertainment', 'Compare DJ and live music options.', '2026-11-05', 'Entertainment', 2, 'not_started', null, 80, null, '10000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.timeline_items (
  id, wedding_id, timeline_type, title, starts_at, ends_at, location,
  assigned_people, notes, status, sort_order, created_by
) values
  ('51000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'wedding_day', 'Hair & makeup', '2027-10-17 12:30:00-07', '2027-10-17 14:30:00-07', 'Getting Ready Suite', array['Wedding party'], null, 'not_started', 10, '10000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'wedding_day', 'Photography begins', '2027-10-17 14:45:00-07', '2027-10-17 15:30:00-07', 'Spanish Revival arches', array['Olivia', 'Marcus', 'Photographer'], 'Prioritize quiet architectural frames.', 'not_started', 20, '10000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'wedding_day', 'Ceremony', '2027-10-17 16:30:00-07', '2027-10-17 17:00:00-07', 'Courtyard', array['All guests'], null, 'not_started', 30, '10000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'wedding_day', 'Cocktail hour', '2027-10-17 17:00:00-07', '2027-10-17 18:00:00-07', 'Fountain terrace', array['All guests'], null, 'not_started', 40, '10000000-0000-0000-0000-000000000001'),
  ('51000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'wedding_day', 'Dinner & dancing', '2027-10-17 18:15:00-07', '2027-10-17 22:30:00-07', 'Theatre', array['All guests'], null, 'not_started', 50, '10000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.budget_categories (id, wedding_id, name, target_amount, sort_order, is_padua, created_by) values
  ('52000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Venue', 28000, 10, true, '10000000-0000-0000-0000-000000000001'),
  ('52000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'Catering', 18000, 20, false, '10000000-0000-0000-0000-000000000001'),
  ('52000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'Photography', 8500, 30, false, '10000000-0000-0000-0000-000000000001'),
  ('52000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'Florals', 9000, 40, false, '10000000-0000-0000-0000-000000000001'),
  ('52000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'Entertainment', 4500, 50, false, '10000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.budget_items (id, wedding_id, category_id, name, estimated_amount, actual_amount, paid_amount, due_date, payment_status, created_by) values
  ('53000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '52000000-0000-0000-0000-000000000001', 'Padua venue estimate', 28000, 28000, 7000, '2027-02-17', 'partially_paid', '10000000-0000-0000-0000-000000000001'),
  ('53000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '52000000-0000-0000-0000-000000000002', 'Dinner service', 18000, 0, 0, '2027-09-17', 'not_scheduled', '10000000-0000-0000-0000-000000000001'),
  ('53000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', '52000000-0000-0000-0000-000000000003', 'Photography', 8500, 8200, 2500, '2027-08-17', 'partially_paid', '10000000-0000-0000-0000-000000000001'),
  ('53000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', '52000000-0000-0000-0000-000000000004', 'Florals & ceremony design', 9000, 0, 0, '2027-09-01', 'not_scheduled', '10000000-0000-0000-0000-000000000001'),
  ('53000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', '52000000-0000-0000-0000-000000000005', 'Entertainment', 4500, 4200, 1000, '2027-09-17', 'partially_paid', '10000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.guests (id, wedding_id, first_name, last_name, household, email, rsvp_status, meal_preference, dietary_restrictions, plus_one, is_child, table_assignment, created_by) values
  ('54000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Elena', 'Rivera', 'Rivera Household', 'elena@example.com', 'attending', 'Vegetarian', null, false, false, '8', '10000000-0000-0000-0000-000000000001'),
  ('54000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'Daniel', 'Rivera', 'Rivera Household', 'daniel@example.com', 'attending', 'Chicken', null, false, false, '8', '10000000-0000-0000-0000-000000000001'),
  ('54000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'Sofia', 'Chen', 'Chen Household', 'sofia@example.com', 'invited', null, 'Gluten-free', true, false, null, '10000000-0000-0000-0000-000000000001'),
  ('54000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'Noah', 'Williams', 'Williams Household', 'noah@example.com', 'no_response', null, null, false, false, null, '10000000-0000-0000-0000-000000000001'),
  ('54000000-0000-0000-0000-000000000005', '40000000-0000-0000-0000-000000000001', 'Amelia', 'Brooks', 'Brooks Household', 'amelia@example.com', 'declined', null, null, false, false, null, '10000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.vendors (id, wedding_id, business_name, contact_name, email, category, contract_status, deposit, total_cost, notes, rating, is_padua_preferred, created_by) values
  ('55000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Padua Weddings', 'Claire Bennett', 'planning@paduaweddings.com', 'Venue', 'booked', 7000, 28000, 'Primary venue contact', 5, false, '10000000-0000-0000-0000-000000000001'),
  ('55000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'Mariposa Photo Co.', 'Ana Flores', 'ana@example.com', 'Photographer', 'reviewing', 2500, 8200, 'Review analog film option', 5, false, '10000000-0000-0000-0000-000000000001'),
  ('55000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'Olive & Vine Floral', 'Maya Ortiz', 'maya@example.com', 'Florist', 'inquired', 0, 9000, null, null, false, '10000000-0000-0000-0000-000000000001'),
  ('55000000-0000-0000-0000-000000000004', '40000000-0000-0000-0000-000000000001', 'Night Garden Music', 'Theo Martin', 'theo@example.com', 'DJ', 'booked', 1000, 4200, null, 4, false, '10000000-0000-0000-0000-000000000001'),
  ('56000000-0000-0000-0000-000000000001', null, 'Mariposa Photo Co.', 'Ana Flores', 'ana@example.com', 'Photographer', 'preferred', 0, 0, 'Placeholder preferred-vendor record.', 5, true, '20000000-0000-0000-0000-000000000001'),
  ('56000000-0000-0000-0000-000000000002', null, 'Olive & Vine Floral', 'Maya Ortiz', 'maya@example.com', 'Florist', 'preferred', 0, 0, 'Placeholder preferred-vendor record.', 5, true, '20000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.inspiration_items (id, wedding_id, image_url, title, category, notes, source_url, tags, colors, is_favorite, created_by) values
  ('57000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1519225421980-715cb0215aed', 'Textural courtyard florals', 'Ceremony', 'Loose shapes with architectural restraint.', 'https://unsplash.com', array['courtyard','floral'], array['#D8CDBD'], true, '10000000-0000-0000-0000-000000000001'),
  ('57000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1507504031003-b417219a0fde', 'Candlelit dinner', 'Table Design', 'Warm pools of light and low centerpieces.', 'https://unsplash.com', array['candlelight','dinner'], array['#263D32','#B4935A'], true, '10000000-0000-0000-0000-000000000001'),
  ('57000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1464699908537-0954e50791ee', 'Olive and ivory palette', 'Color Palette', null, 'https://unsplash.com', array['olive','ivory'], array['#7D8B72','#F6F1E7'], false, '10000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.venue_preferences (id, wedding_id, section, responses, favorite_locations, created_by) values
  ('58000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'ceremony', '{"preference":"Outdoor","time":"4:30 PM","processional":"Wedding party and family","accessibility":"Confirm step-free guest route"}', array[]::text[], '10000000-0000-0000-0000-000000000001'),
  ('58000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'reception', '{"style":"Seated dinner","danceFloorPriority":"Central to the evening","toasts":"Three brief toasts"}', array[]::text[], '10000000-0000-0000-0000-000000000001'),
  ('58000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'photography', '{"notes":"Prioritize quiet portraits before guest arrival."}', array['Courtyard','Olive trees','Spanish Revival architecture'], '10000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.notes (id, wedding_id, title, content, category, is_pinned, is_internal, created_by) values
  ('59000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', 'Photography priorities', 'Quiet portraits near the olive trees, courtyard architecture, and candid dinner photographs.', 'Photography', true, false, '10000000-0000-0000-0000-000000000001'),
  ('59000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', 'Guest comfort', 'Confirm accessible arrival route and add a transportation note to the invitation site.', 'Guest Experience', false, false, '10000000-0000-0000-0000-000000000001'),
  ('59000000-0000-0000-0000-000000000003', '40000000-0000-0000-0000-000000000001', 'Coordinator context', 'Couple prioritizes guest flow and candid photography.', 'Internal', true, true, '20000000-0000-0000-0000-000000000001')
on conflict (id) do nothing;

insert into public.messages (id, wedding_id, sender_id, category, subject, body, visibility, created_at) values
  ('60000000-0000-0000-0000-000000000001', '40000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'General Help', 'Your planning introduction', 'I’m looking forward to helping you shape the details at Padua.', 'couple_and_staff', '2026-07-11 10:00:00-07'),
  ('60000000-0000-0000-0000-000000000002', '40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Timeline Question', 'Courtyard ceremony timing', 'Could we discuss the best ceremony time for October light?', 'couple_and_staff', '2026-07-09 14:00:00-07')
on conflict (id) do nothing;

insert into public.activity_log (wedding_id, actor_id, event_name, entity_type, properties, created_at) values
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'venue_booked', 'wedding', '{"label":"Padua venue marked booked"}', '2026-07-10 12:00:00-07'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'budget_updated', 'wedding', '{"amount":85000}', '2026-07-08 15:00:00-07'),
  ('40000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'note_pinned', 'note', '{"title":"Photography priorities"}', '2026-07-08 11:00:00-07');

insert into public.checklist_templates (title, description, category, months_before, applies_when, sort_order) values
  ('Book venue', 'Review the agreement and reserve the wedding date.', 'Venue', 18, '{"booking_status":["exploring","not_booked"]}', 10),
  ('Confirm photographer', 'Review coverage, approach, and agreement.', 'Photography', 14, '{}', 20),
  ('Finalize guest list', 'Confirm households and mailing details.', 'Guest List', 10, '{}', 30),
  ('Schedule menu planning', 'Prepare dietary needs and menu questions.', 'Catering', 6, '{"booking_status":["booked"]}', 40),
  ('Submit final guest count', 'Send the confirmed count to the Padua team.', 'Final Details', 1, '{"booking_status":["booked"]}', 50);
