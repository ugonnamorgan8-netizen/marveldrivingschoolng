import { MapPin, Navigation, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Locations = () => {
  const locations = [
    {
      name: "Head Office",
      address: "Old Timber Junction, Umuahia",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      mapUrl: "https://maps.app.goo.gl/zZeFgvGtNJf5qedZ7",
      mapQuery: "Old Timber Junction, Umuahia, Nigeria",
      isPrimary: true,
      note: "Main administrative office",
    },
    {
      name: "Office 1 - Umudike",
      address: "Besides Chaise World Hotel, Umudike",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Chaise+World+Hotel+Umudike+Nigeria",
      mapQuery: "Chaise World Hotel, Umudike, Nigeria",
      isPrimary: false,
    },
    {
      name: "Office 2 - BCA Road",
      address: "BCA Road Umuahia, Opposite Vision Africa Radio",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Vision+Africa+Radio+BCA+Road+Umuahia",
      mapQuery: "Vision Africa Radio, BCA Road, Umuahia, Nigeria",
      isPrimary: false,
      note: "FRSC-approved practical training ground",
    },
    {
      name: "Office 3 - Aba Road",
      address: "Post Office, Aba Road, Umuahia",
      hours: "Monday - Friday: 8:00 AM - 6:00 PM",
      mapUrl: "https://www.google.com/maps/search/?api=1&query=Post+Office+Aba+Road+Umuahia",
      mapQuery: "Post Office, Aba Road, Umuahia, Nigeria",
      isPrimary: false,
    },
  ];

  return (
    <section id="locations" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-primary bg-clip-text text-transparent">Locations</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground">
            Four convenient offices across Umuahia & Aba — find the branch closest to you
          </p>
        </div>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {locations.map((location) => (
            <Card
              key={location.name}
              className={`hover:shadow-hover transition-all duration-300 flex flex-col ${
                location.isPrimary ? 'border-2 border-primary' : ''
              }`}
            >
              <CardContent className="p-6 md:p-8 flex flex-col flex-1">
                {location.isPrimary && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold mb-4 self-start">
                    <Navigation className="w-3 h-3" />
                    HEAD OFFICE
                  </div>
                )}

                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-12 h-12 ${location.isPrimary ? 'bg-primary' : 'bg-primary/10'} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <MapPin className={`w-6 h-6 ${location.isPrimary ? 'text-white' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg md:text-xl font-bold mb-2">{location.name}</h3>
                    <p className="text-sm md:text-base text-muted-foreground mb-2">{location.address}</p>
                    <p className="text-xs text-muted-foreground mb-2">{location.hours}</p>
                    {location.note && (
                      <p className="text-xs text-primary font-medium">{location.note}</p>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="w-full"
                  >
                    <a
                      href={location.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${location.name} in Google Maps`}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open in Google Maps
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Important Notice */}
        <div className="mt-12 bg-accent p-6 md:p-8 rounded-xl border border-border max-w-4xl mx-auto">
          <h3 className="text-xl font-bold mb-3 text-center">Important Notice</h3>
          <p className="text-center text-muted-foreground">
            All practical driving training sessions take place at the <strong>BCA Road location</strong> opposite Vision Africa Radio, our FRSC-approved training ground. Other offices serve registration and inquiries.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Locations;
