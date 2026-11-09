-- ========================================
-- CARTHAGE DRIVE - Sample/Seed Data
-- ========================================
-- Import this file after carthage_drive.sql
-- This data is for testing and demonstration
-- ========================================

USE carthage_drive_2;

-- ========================================
-- INSERT: Admin and Test Users
-- ========================================

-- Admin User
-- Email: admin@carthagedrive.tn
-- Password: Admin@123456 (hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, phone, password, role, status)
VALUES ('Admin', 'Carthage', 'admin@carthagedrive.tn', '+216 95 123 456', 
        '$2y$10$gzrqEATb9jXXizFSGXGC2.Q4OYu.uNT1to7HzngclPWBFProAuaPe', 'ADMIN', 'ACTIVE');

-- Test Client User 1
-- Email: client@carthagedrive.tn
-- Password: Client@123456
INSERT INTO users (first_name, last_name, email, phone, password, role, status)
VALUES ('Ahmed', 'Ben Ali', 'client@carthagedrive.tn', '+216 91 234 567', 
        '$2y$10$BZLK2JEPNdvSpo.NLzEGj.FKGzYhyDlgt7YTdX340iw1oNRdMx316', 'CLIENT', 'ACTIVE');

-- Test Client User 2
INSERT INTO users (first_name, last_name, email, phone, password, role, status)
VALUES ('Fatima', 'Karray', 'fatima.karray@gmail.com', '+216 92 345 678', 
        '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'CLIENT', 'ACTIVE');

-- Test Client User 3
INSERT INTO users (first_name, last_name, email, phone, password, role, status)
VALUES ('Mohamed', 'Salah', 'mohamed.salah@email.com', '+216 93 456 789', 
        '$2y$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36gZvWFm', 'CLIENT', 'ACTIVE');

-- ========================================
-- INSERT: Cars (Fleet)
-- ========================================

-- 1. Peugeot 208 (Économique)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Peugeot', '208', 2023, 'Économique', 35.00, 'Essence', 'Manuelle', 5, 5, 
        'Voiture économique compacte, parfaite pour les trajets urbains. Consommation faible, manœuvrabilité excellente.', 'ACTIVE');

-- 2. Renault Clio (Économique)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Renault', 'Clio', 2023, 'Économique', 40.00, 'Essence', 'Manuelle', 5, 5, 
        'Clio dernière génération. Fiable, économe et agréable à conduire. Idéale pour les vacances en famille.', 'ACTIVE');

-- 3. Volkswagen Golf (Compacte)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Volkswagen', 'Golf', 2023, 'Compacte', 50.00, 'Diesel', 'Automatique', 5, 5, 
        'Golf 8 avec boîte automatique. Technologie moderne, confort premium, consommation optimisée.', 'ACTIVE');

-- 4. Toyota Yaris (Économique)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Toyota', 'Yaris', 2023, 'Économique', 38.00, 'Essence', 'Automatique', 5, 5, 
        'Toyota Yaris avec boîte automatique. Fiabilité légendaire Toyota, confort optimal pour les trajets.', 'ACTIVE');

-- 5. BMW Série 3 (Berline)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('BMW', 'Série 3', 2022, 'Berline', 85.00, 'Diesel', 'Automatique', 5, 4, 
        'Berline de luxe avec intérieur premium. Technologie iDrive, confort maximal, performance remarquable.', 'ACTIVE');

-- 6. Mercedes Classe C (Berline)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Mercedes-Benz', 'Classe C', 2022, 'Berline', 90.00, 'Diesel', 'Automatique', 5, 4, 
        'Classe C avec ensemble premium complet. Design élégant, technologie avancée, sécurité maximale.', 'ACTIVE');

-- 7. Audi A4 (Premium)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Audi', 'A4', 2023, 'Premium', 95.00, 'Diesel', 'Automatique', 5, 4, 
        'Audi A4 dernière génération avec Quattro. Intérieur luxe, système multimedia Audi MMI, performance sportive.', 'ACTIVE');

-- 8. Hyundai Tucson (SUV)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Hyundai', 'Tucson', 2023, 'SUV', 65.00, 'Essence', 'Automatique', 7, 5, 
        'SUV spacieux avec 7 places. Confortable pour les familles, bon clearance, système multimédia moderne.', 'ACTIVE');

-- 9. Volkswagen Tiguan (SUV)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Volkswagen', 'Tiguan', 2023, 'SUV', 70.00, 'Diesel', 'Automatique', 7, 5, 
        'SUV premium avec 7 places. Transmission intégrale 4Motion, technologie Volkswagen avancée.', 'ACTIVE');

-- 10. Tesla Model 3 (Premium - Électrique)
INSERT INTO cars (brand, model, year, category, price_per_day, fuel_type, transmission, seats, doors, description, status)
VALUES ('Tesla', 'Model 3', 2023, 'Premium', 120.00, 'Électrique', 'Automatique', 5, 4, 
        'Voiture électrique haute performance. Autonomie 500km, recharge rapide, technologie autopilot.', 'ACTIVE');

-- ========================================
-- INSERT: Car Images
-- ========================================

-- Peugeot 208 Images
INSERT INTO car_images (car_id, image_url) VALUES (1, '/uploads/cars/peugeot-208-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (1, '/uploads/cars/peugeot-208-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (1, '/uploads/cars/peugeot-208-3.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (1, '/uploads/cars/peugeot-208-site.jpg');

-- Renault Clio Images
INSERT INTO car_images (car_id, image_url) VALUES (2, '/uploads/cars/renault-clio-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (2, '/uploads/cars/renault-clio-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (2, '/uploads/cars/renault-clio-site.jpg');

-- Volkswagen Golf Images
INSERT INTO car_images (car_id, image_url) VALUES (3, '/uploads/cars/vw-golf-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (3, '/uploads/cars/vw-golf-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (3, '/uploads/cars/vw-golf-site.jpg');

-- Toyota Yaris Images
INSERT INTO car_images (car_id, image_url) VALUES (4, '/uploads/cars/toyota-yaris-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (4, '/uploads/cars/toyota-yaris-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (4, '/uploads/cars/toyota-yaris-site.jpg');

-- BMW Série 3 Images
INSERT INTO car_images (car_id, image_url) VALUES (5, '/uploads/cars/bmw-3-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (5, '/uploads/cars/bmw-3-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (5, '/uploads/cars/bmw-serie-3-site.jpg');

-- Mercedes Classe C Images
INSERT INTO car_images (car_id, image_url) VALUES (6, '/uploads/cars/mercedes-c-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (6, '/uploads/cars/mercedes-c-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (6, '/uploads/cars/mercedes-classe-c-site.jpg');

-- Audi A4 Images
INSERT INTO car_images (car_id, image_url) VALUES (7, '/uploads/cars/audi-a4-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (7, '/uploads/cars/audi-a4-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (7, '/uploads/cars/audi-a4-site.jpg');

-- Hyundai Tucson Images
INSERT INTO car_images (car_id, image_url) VALUES (8, '/uploads/cars/hyundai-tucson-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (8, '/uploads/cars/hyundai-tucson-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (8, '/uploads/cars/hyundai-tucson-site.jpg');

-- Volkswagen Tiguan Images
INSERT INTO car_images (car_id, image_url) VALUES (9, '/uploads/cars/vw-tiguan-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (9, '/uploads/cars/vw-tiguan-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (9, '/uploads/cars/vw-tiguan-site.jpg');

-- Tesla Model 3 Images
INSERT INTO car_images (car_id, image_url) VALUES (10, '/uploads/cars/tesla-model3-1.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (10, '/uploads/cars/tesla-model3-2.jpg');
INSERT INTO car_images (car_id, image_url) VALUES (10, '/uploads/cars/tesla-model-3-site.jpg');

-- ========================================
-- INSERT: Sample Bookings
-- ========================================

-- Booking 1: Ahmed Ben Ali - Peugeot 208
INSERT INTO bookings (booking_number, user_id, car_id, start_date, end_date, pickup_location, return_location, 
                      total_days, price_per_day, total_price, status)
VALUES ('BK000001', 2, 1, '2026-08-25', '2026-08-28', 'Tunis Centre', 'Tunis Centre', 
        3, 35.00, 105.00, 'CONFIRMED');

-- Booking 2: Fatima Karray - BMW Série 3
INSERT INTO bookings (booking_number, user_id, car_id, start_date, end_date, pickup_location, return_location, 
                      total_days, price_per_day, total_price, status)
VALUES ('BK000002', 3, 5, '2026-08-26', '2026-08-30', 'Aéroport de Tunis', 'Hôtel Hilton', 
        4, 85.00, 340.00, 'CONFIRMED');

-- Booking 3: Mohamed Salah - Hyundai Tucson
INSERT INTO bookings (booking_number, user_id, car_id, start_date, end_date, pickup_location, return_location, 
                      total_days, price_per_day, total_price, status)
VALUES ('BK000003', 4, 8, '2026-09-01', '2026-09-08', 'Sousse Centre', 'Monastir', 
        7, 65.00, 455.00, 'PENDING');

-- Booking 4: Ahmed Ben Ali - Renault Clio (Past)
INSERT INTO bookings (booking_number, user_id, car_id, start_date, end_date, pickup_location, return_location, 
                      total_days, price_per_day, total_price, status)
VALUES ('BK000004', 2, 2, '2026-08-15', '2026-08-18', 'Tunis Centre', 'Tunis Centre', 
        3, 40.00, 120.00, 'COMPLETED');

-- ========================================
-- INSERT: Payments
-- ========================================

-- Payment for Booking 1
INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id)
VALUES (1, 105.00, 'AGENCY', 'PAID', 'TXN-2026-08-22-001');

-- Payment for Booking 2
INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id)
VALUES (2, 340.00, 'AGENCY', 'PAID', 'TXN-2026-08-22-002');

-- Payment for Booking 3
INSERT INTO payments (booking_id, amount, payment_method, status)
VALUES (3, 455.00, 'AGENCY', 'PENDING');

-- Payment for Booking 4
INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id)
VALUES (4, 120.00, 'AGENCY', 'PAID', 'TXN-2026-08-15-001');

-- ========================================
-- INSERT: Reviews
-- ========================================

-- Review 1: Ahmed Ben Ali for Peugeot 208
INSERT INTO reviews (user_id, car_id, rating, comment)
VALUES (2, 1, 4, 'Très bonne voiture, économe et fiable. Première location excellente!');

-- Review 2: Fatima Karray for BMW Série 3
INSERT INTO reviews (user_id, car_id, rating, comment)
VALUES (3, 5, 5, 'Luxe et confort inégalés. Service impeccable. Recommande vivement!');

-- Review 3: Ahmed Ben Ali for Renault Clio
INSERT INTO reviews (user_id, car_id, rating, comment)
VALUES (2, 2, 5, 'Clio parfaite pour les trajets. Bonne qualité, bien entretenue.');

-- ========================================
-- INSERT: Contact Messages (Sample)
-- ========================================

INSERT INTO contact_messages (name, email, phone, subject, message, status)
VALUES ('Ali Trabelsi', 'ali@example.com', '+216 91 123 456', 
        'Demande de tarif groupe', 'Je souhaite louer 5 voitures pour une semaine. Pouvez-vous me faire un tarif préférentiel?', 'NEW');

INSERT INTO contact_messages (name, email, phone, subject, message, status)
VALUES ('Leila Mansouri', 'leila@example.com', '+216 92 234 567', 
        'Question sur les assurances', 'Quelle est votre couverture d\'assurance? Y a-t-il une franchise?', 'RESOLVED');

-- ========================================
-- Data Import Completed Successfully
-- ========================================
COMMIT;
