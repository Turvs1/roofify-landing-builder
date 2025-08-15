import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Phone, Clock, Award } from 'lucide-react';

interface LocalAreaInfoProps {
  area: 'Brisbane' | 'Gold Coast' | 'Sunshine Coast' | 'Logan' | 'Ipswich';
  suburbs: string[];
  specializations: string[];
  responseTime: string;
  localFeatures: string[];
}

const LocalAreaInfo: React.FC<LocalAreaInfoProps> = ({
  area,
  suburbs,
  specializations,
  responseTime,
  localFeatures
}) => {
  const getAreaIcon = () => {
    switch (area) {
      case 'Brisbane':
        return '🏙️';
      case 'Gold Coast':
        return '🏖️';
      case 'Sunshine Coast':
        return '🌅';
      case 'Logan':
        return '🏘️';
      case 'Ipswich':
        return '🏛️';
      default:
        return '📍';
    }
  };

  const getAreaDescription = () => {
    switch (area) {
      case 'Brisbane':
        return 'Queensland\'s capital city with diverse roofing needs from heritage homes to modern commercial buildings.';
      case 'Gold Coast':
        return 'Coastal environment requiring specialized roofing solutions for salt air, high winds, and tropical storms.';
      case 'Sunshine Coast':
        return 'Beautiful coastal and hinterland areas needing roofing that withstands both coastal conditions and hinterland weather.';
      case 'Logan':
        return 'Growing suburban area with mix of residential and commercial roofing projects.';
      case 'Ipswich':
        return 'Historic city with heritage buildings requiring specialized restoration and modern roofing solutions.';
      default:
        return 'Professional roofing services tailored to local conditions and requirements.';
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-gradient-to-br from-arw-navy to-arw-blue text-white">
      <CardHeader className="text-center">
        <div className="text-4xl mb-2">{getAreaIcon()}</div>
        <CardTitle className="text-2xl text-white">{area} Roofing Services</CardTitle>
        <p className="text-gray-200">{getAreaDescription()}</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Local Suburbs */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Areas We Serve
          </h4>
          <div className="flex flex-wrap gap-2">
            {suburbs.map((suburb, index) => (
              <Badge key={index} variant="secondary" className="bg-white/20 text-white border-white/30">
                {suburb}
              </Badge>
            ))}
          </div>
        </div>

        {/* Specializations */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Award className="w-4 h-4" />
            Local Specializations
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {specializations.map((spec, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>{spec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Response Time */}
        <div className="bg-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-arw-blue" />
            <div>
              <p className="font-semibold">Emergency Response Time</p>
              <p className="text-sm text-gray-200">{responseTime}</p>
            </div>
          </div>
        </div>

        {/* Local Features */}
        <div>
          <h4 className="font-semibold mb-3">Why Choose ARW for {area}</h4>
          <div className="space-y-2">
            {localFeatures.map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <div className="w-1.5 h-1.5 bg-arw-blue rounded-full mt-2 flex-shrink-0"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <button className="bg-white text-arw-navy px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Get {area} Quote
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocalAreaInfo;
