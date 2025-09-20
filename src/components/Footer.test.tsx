import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer', () => {
  it('renders the footer with company info and org number', () => {
    render(<Footer />);

    // Check for company name
    expect(screen.getByText('RentCars')).toBeInTheDocument();

    // Check for copyright
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(`© ${currentYear} RentCars. All rights reserved.`)).toBeInTheDocument();

    // Check for the new organization number
    expect(screen.getByText('A ONE KUMARASAMY org nr:922103682')).toBeInTheDocument();

    // Check for quick links
    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
    expect(screen.getByText('Our Cars')).toBeInTheDocument();

    // Check for legal links
    expect(screen.getByText('Legal')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
    expect(screen.getByText('Terms & Conditions')).toBeInTheDocument();

    // Check for social media icons
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /facebook|instagram/i })).toHaveLength(2);
  });
});
