const WebsiteContent = require('./websiteContent.model');

class WebsiteContentService {
  async getContentBySection(section) {
    const content = await WebsiteContent.findOne({ section, isActive: true }).lean();
    return content;
  }

  async getAllContent() {
    const contents = await WebsiteContent.find({ isActive: true }).lean();
    return contents;
  }

  async updateContent(section, content, userId) {
    const updatedContent = await WebsiteContent.findOneAndUpdate(
      { section },
      { content, updatedBy: userId, isActive: true },
      { returnDocument: 'after', runValidators: true, upsert: true }
    );
    return updatedContent;
  }

  async getHeroContent() {
    let content = await this.getContentBySection('hero');
    if (!content) {
      content = {
        section: 'hero',
        content: {
          tagline: '#1 Real Estate Platform',
          title: 'Find Your Dream Property With Us',
          subtitle: 'Discover the perfect plot, residential, or commercial property. We offer a curated selection of premium properties with transparent pricing and expert guidance.',
          stats: [
            { label: 'Properties Listed', value: 500, suffix: '+', icon: 'TrendingUp' },
            { label: 'Happy Customers', value: 1000, suffix: '+', icon: 'Users' },
            { label: 'Average Rating', value: 4.9, suffix: '', decimals: 1, icon: 'Star' },
          ],
          primaryCTA: { text: 'Explore Properties', link: '/properties' },
          secondaryCTA: { text: 'Watch Video', action: 'video' },
          videoUrl: '/landVideo.mp4',
        },
      };
    }
    return content;
  }

  async getTestimonials() {
    let content = await this.getContentBySection('testimonials');
    if (!content) {
      content = {
        section: 'testimonials',
        content: {
          title: 'What Our Clients Say',
          subtitle: 'Hear from our satisfied customers who found their dream properties through PlotVastu.',
          testimonials: [
            {
              id: 1,
              name: 'Rajesh Sharma',
              role: 'Home Buyer',
              content: 'Found my dream plot through PlotVastu. The team was extremely helpful and professional throughout the process.',
              rating: 5,
              image: '/testimonials/person1.jpg',
            },
            {
              id: 2,
              name: 'Priya Patel',
              role: 'Investor',
              content: 'Excellent selection of properties. The website made it easy to compare different options and make an informed decision.',
              rating: 5,
              image: '/testimonials/person2.jpg',
            },
            {
              id: 3,
              name: 'Amit Kumar',
              role: 'Property Owner',
              content: 'Listed my property and got genuine inquiries within days. The platform really works!',
              rating: 5,
              image: '/testimonials/person3.jpg',
            },
          ],
        },
      };
    }
    return content;
  }

  async getFooterContent() {
    let content = await this.getContentBySection('footer');
    if (!content) {
      content = {
        section: 'footer',
        content: {
          description: 'Your trusted partner in finding the perfect property. We offer a wide range of plots, residential, and commercial properties.',
          contact: {
            phone: '+91 8249307969',
            email: 'info@plotvastu.com',
            address: '123 Main Street, City, State - 123456',
          },
          socialLinks: {
            facebook: '#',
            twitter: '#',
            instagram: '#',
            linkedin: '#',
          },
          quickLinks: [
            { label: 'Home', href: '/' },
            { label: 'Properties', href: '/properties' },
            { label: 'Contact Us', href: '/contact' },
          ],
          propertyTypes: [
            { label: 'Plots & Land', href: '/properties?type=plot' },
            { label: 'Residential', href: '/properties?type=residential' },
            { label: 'Commercial', href: '/properties?type=commercial' },
            { label: 'Apartments', href: '/properties?type=apartment' },
          ],
        },
      };
    }
    return content;
  }

  async getSiteSettings() {
    let content = await this.getContentBySection('siteSettings');
    if (!content) {
      content = {
        section: 'siteSettings',
        content: {
          siteName: 'PlotVastu',
          tagline: 'Find Your Dream Property',
          logo: '/logo.png',
          favicon: '/favicon.ico',
        },
      };
    }
    return content;
  }
}

module.exports = new WebsiteContentService();
