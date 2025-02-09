export const TargetAudienceSection = () => {
  return (
    <div className="max-w-6xl mx-auto my-16">
      <h1 className="text-3xl font-semibold text-center mb-12">Optimized to Meet the Needs Of</h1>
      <div className="grid md:grid-cols-3 gap-8">
        <AudienceCard
          title="Product Managers"
          features={[
            {
              title: "Discover User Pain Points",
              description: "Identify hidden issues directly from user voices."
            },
            {
              title: "Feature Feedback",
              description: "Gather detailed feature requests and understand user needs."
            }
          ]}
        />
        <AudienceCard
          title="Marketers"
          features={[
            {
              title: "Voice Testimonials",
              description: "Collect authentic customer testimonials to build trust."
            },
            {
              title: "Campaign Insights",
              description: "Capture real-time feedback on marketing campaigns."
            }
          ]}
        />
        <AudienceCard
          title="User Researchers"
          features={[
            {
              title: "Qualitative Research",
              description: "Dive deeper with voice data for richer user interviews."
            },
            {
              title: "Usability Feedback",
              description: "Analyze tone and sentiment beyond written words."
            }
          ]}
        />
      </div>
    </div>
  );
};

interface Feature {
  title: string;
  description: string;
}

interface AudienceCardProps {
  title: string;
  features: Feature[];
}

const AudienceCard = ({ title, features }: AudienceCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-xl font-semibold mb-4 text-primary">{title}</h3>
      <div className="space-y-4">
        {features.map((feature, index) => (
          <div key={index}>
            <h4 className="font-medium mb-2">{feature.title}</h4>
            <p className="text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};