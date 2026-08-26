export type Language = 'no' | 'en';

export const LANGUAGE_STORAGE_KEY = 'rentcars-language';

export const translations = {
  no: {
    // Header / nav
    nav_home: 'Hjem',
    nav_about: 'Om oss',
    nav_cars: 'Biler',
    nav_contact: 'Kontakt',
    nav_login: 'Logg inn',
    nav_dashboard: 'Min side',
    nav_logout: 'Logg ut',
    nav_open_menu: 'Åpne meny',
    nav_close_menu: 'Lukk meny',

    // Footer
    footer_tagline:
      'Din foretrukne leverandør av leiebil. Vi tilbyr et bredt utvalg av kjøretøy som passer dine behov, for en trygg og hyggelig reise.',
    footer_rights: '© {year} RentCars. Alle rettigheter forbeholdt.',
    footer_quick_links: 'Snarveier',
    footer_about_us: 'Om oss',
    footer_contact: 'Kontakt',
    footer_our_cars: 'Våre biler',
    footer_legal: 'Juridisk',
    footer_privacy: 'Personvernerklæring',
    footer_terms: 'Vilkår og betingelser',
    footer_follow_us: 'Følg oss',

    // Homepage
    hero_badge: 'Bilutleie i Bergen',
    hero_title: 'Finn din perfekte bil i Bergen',
    hero_subtitle: 'Lei bil til ditt neste eventyr',
    why_choose_title: 'Hvorfor velge oss?',
    why_choose_wide_title: 'Bredt utvalg av biler',
    why_choose_wide_desc:
      'Vi har et bredt utvalg av biler å velge mellom. Du kan velge bilen som passer best til dine behov.',
    why_choose_price_title: 'Beste pris-garanti',
    why_choose_price_desc:
      'Vi tilbyr de beste prisene på våre biler. Du kan være trygg på at du får det beste tilbudet.',
    why_choose_support_title: 'Kundeservice døgnet rundt',
    why_choose_support_desc:
      'Vi er her for å hjelpe deg med alle spørsmål du måtte ha. Vår kundeservice er tilgjengelig 24/7.',
    explore_title: 'Utforsk Bergen',
    explore_desc:
      'Utforsk den vakre byen Bergen og omegn med en av våre leiebiler. Vi har et bredt utvalg av biler å velge mellom, slik at du finner den perfekte for din tur.',
    book_now: 'Book nå',
    testimonials_title: 'Hva sier våre kunder',

    // Search form
    search_select_town: 'Velg by',
    search_adults_placeholder: 'Voksne',
    search_children_placeholder: 'Barn',
    search_car_type_placeholder: 'Biltype',
    search_start_date: 'Startdato',
    search_end_date: 'Sluttdato',
    search_button: 'Søk etter biler',
    search_error_required: 'Vennligst velg by, startdato og sluttdato.',
    search_error_loading_options: 'Kunne ikke laste filtervalg.',

    // Login
    login_hero_title: 'Logg inn',
    login_welcome: 'Velkommen tilbake',
    login_subtitle: 'Logg inn for å administrere bestillingene dine.',
    login_email_label: 'E-post',
    login_password_label: 'Passord',
    login_button: 'Logg inn',
    login_logging_in: 'Logger inn...',
    login_no_account: 'Har du ikke en konto?',
    login_signup_link: 'Registrer deg',
    login_show_password: 'Vis passord',
    login_hide_password: 'Skjul passord',

    // Signup
    signup_hero_title: 'Registrer deg',
    signup_create_account: 'Opprett en konto',
    signup_full_name_label: 'Fullt navn',
    signup_email_label: 'E-post',
    signup_password_label: 'Passord',
    signup_button: 'Registrer deg',
    signup_signing_up: 'Registrerer...',
    signup_already_have_account: 'Har du allerede en konto?',
    signup_login_link: 'Logg inn',
    signup_success: 'Sjekk e-posten din for å bekrefte kontoen din.',

    // About
    about_hero_title: 'Om oss',
    about_who_we_are: 'Hvem vi er',
    about_p1:
      'Velkommen til RentCars, ditt førstevalg for problemfri bilutleie. Vi er opptatt av å gi deg en sømløs og hyggelig opplevelse, med et bredt utvalg av kjøretøy som passer ethvert behov og budsjett.',
    about_p2:
      'Vår misjon er å gjøre bilutleie enkelt, transparent og tilgjengelig. Vi tror på konkurransedyktige priser, tydelige vilkår og eksepsjonell kundeservice.',
    about_p3:
      'Enten du planlegger en familieferie, en forretningsreise, eller bare trenger en bil for en dag, har RentCars deg dekket. Utforsk vår bilpark og start eventyret ditt i dag!',

    // Contact
    contact_hero_title: 'Kontakt oss',
    contact_get_in_touch: 'Ta kontakt',
    contact_intro: 'Har du spørsmål eller trenger hjelp? Vi er her for deg!',
    contact_email_label: 'E-post:',
    contact_name_label: 'Navn:',
    contact_email_field_label: 'E-post:',
    contact_subject_label: 'Emne:',
    contact_message_label: 'Melding:',
    contact_send_button: 'Send melding',
    contact_sending: 'Sender...',
    contact_success: 'Meldingen din har blitt sendt!',
    contact_error: 'Det oppstod en feil under sending. Vennligst prøv igjen senere.',
    contact_looking_forward: 'Vi ser frem til å høre fra deg!',

    // Cars listing
    cars_hero_title: 'Våre biler',
    cars_filters_title: 'Filtre',
    cars_show_options: 'Vis valg',
    cars_hide_options: 'Skjul valg',
    cars_clear_all: 'Fjern alle',
    cars_town_label: 'By',
    cars_car_type_label: 'Biltype',
    cars_error_prefix: 'Feil:',

    // Car card
    carcard_seats: 'seter',
    carcard_per_day: '/dag',
    carcard_days_selected: '{days} dag(er) valgt.',
    carcard_total: 'Totalt:',

    loading_text: 'Laster...',
  },
  en: {
    // Header / nav
    nav_home: 'Home',
    nav_about: 'About',
    nav_cars: 'Cars',
    nav_contact: 'Contact',
    nav_login: 'Login',
    nav_dashboard: 'Dashboard',
    nav_logout: 'Logout',
    nav_open_menu: 'Open menu',
    nav_close_menu: 'Close menu',

    // Footer
    footer_tagline:
      'Your premier destination for car rentals. We offer a wide range of vehicles to suit your needs, ensuring a smooth and enjoyable journey.',
    footer_rights: '© {year} RentCars. All rights reserved.',
    footer_quick_links: 'Quick Links',
    footer_about_us: 'About Us',
    footer_contact: 'Contact',
    footer_our_cars: 'Our Cars',
    footer_legal: 'Legal',
    footer_privacy: 'Privacy Policy',
    footer_terms: 'Terms & Conditions',
    footer_follow_us: 'Follow Us',

    // Homepage
    hero_badge: 'Car Rental in Bergen',
    hero_title: 'Find Your Perfect Car in Bergen',
    hero_subtitle: 'Rent a car for your next adventure',
    why_choose_title: 'Why Choose Us?',
    why_choose_wide_title: 'Wide Range of Cars',
    why_choose_wide_desc:
      'We have a wide range of cars to choose from. You can choose the car that best suits your needs.',
    why_choose_price_title: 'Best Price Guarantee',
    why_choose_price_desc:
      'We offer the best price for our cars. You can be sure that you are getting the best deal.',
    why_choose_support_title: '24/7 Customer Support',
    why_choose_support_desc:
      'We are here to help you with any questions you may have. Our customer support is available 24/7.',
    explore_title: 'Explore Bergen',
    explore_desc:
      'Explore the beautiful city of Bergen and its surroundings with one of our rental cars. We have a wide range of cars to choose from, so you can find the perfect one for your trip.',
    book_now: 'Book Now',
    testimonials_title: 'What Our Clients Say',

    // Search form
    search_select_town: 'Select Town',
    search_adults_placeholder: 'Adults',
    search_children_placeholder: 'Children',
    search_car_type_placeholder: 'Car Type',
    search_start_date: 'Start Date',
    search_end_date: 'End Date',
    search_button: 'Search Cars',
    search_error_required: 'Please select a town, start date, and end date.',
    search_error_loading_options: 'Failed to load filter options.',

    // Login
    login_hero_title: 'Login',
    login_welcome: 'Welcome Back',
    login_subtitle: 'Log in to manage your bookings.',
    login_email_label: 'Email',
    login_password_label: 'Password',
    login_button: 'Login',
    login_logging_in: 'Logging in...',
    login_no_account: "Don't have an account?",
    login_signup_link: 'Sign up',
    login_show_password: 'Show password',
    login_hide_password: 'Hide password',

    // Signup
    signup_hero_title: 'Sign Up',
    signup_create_account: 'Create an Account',
    signup_full_name_label: 'Full Name',
    signup_email_label: 'Email',
    signup_password_label: 'Password',
    signup_button: 'Sign Up',
    signup_signing_up: 'Signing up...',
    signup_already_have_account: 'Already have an account?',
    signup_login_link: 'Log in',
    signup_success: 'Please check your email to confirm your account.',

    // About
    about_hero_title: 'About Us',
    about_who_we_are: 'Who We Are',
    about_p1:
      'Welcome to RentCars, your premier destination for hassle-free car rentals. We are dedicated to providing you with a seamless and enjoyable experience, offering a wide selection of vehicles to suit every need and budget.',
    about_p2:
      'Our mission is to make car rental simple, transparent, and accessible. We believe in offering competitive prices, clear terms, and exceptional customer service.',
    about_p3:
      'Whether you are planning a family vacation, a business trip, or just need a car for a day, RentCars has you covered. Explore our fleet and start your adventure today!',

    // Contact
    contact_hero_title: 'Contact Us',
    contact_get_in_touch: 'Get in Touch',
    contact_intro: "Have questions or need assistance? We're here to help!",
    contact_email_label: 'Email:',
    contact_name_label: 'Name:',
    contact_email_field_label: 'Email:',
    contact_subject_label: 'Subject:',
    contact_message_label: 'Message:',
    contact_send_button: 'Send Message',
    contact_sending: 'Sending...',
    contact_success: 'Your message has been sent successfully!',
    contact_error: 'There was an error sending your message. Please try again later.',
    contact_looking_forward: 'We look forward to hearing from you!',

    // Cars listing
    cars_hero_title: 'Our Cars',
    cars_filters_title: 'Filters',
    cars_show_options: 'Show Options',
    cars_hide_options: 'Hide Options',
    cars_clear_all: 'Clear All',
    cars_town_label: 'Town',
    cars_car_type_label: 'Car Type',
    cars_error_prefix: 'Error:',

    // Car card
    carcard_seats: 'seats',
    carcard_per_day: '/day',
    carcard_days_selected: '{days} day(s) selected.',
    carcard_total: 'Total:',

    loading_text: 'Loading...',
  },
} as const satisfies Record<Language, Record<string, string>>;

export type TranslationKey = keyof typeof translations.en;
