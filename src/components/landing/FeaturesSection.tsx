
import { AudioWaveform, FileText, BarChart3, SmilePlus } from "lucide-react";

export const FeaturesSection = () => {
  return (
    <div className="w-full bg-[#F9F8F9] px-4 py-16 my-16 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.03)]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-center mb-12 leading-[1.5]">Core Features of AudioForms</h1>
        <div className="grid md:grid-cols-2 gap-8">
          <FeatureCard
            icon={<AudioWaveform className="text-primary w-8 h-8" />}
            title="Audio Feedback Capture"
            description="Enable users to record and submit voice feedback easily."
            features={[
              "In-browser voice recording functionality with play, pause, re-record, and stop options.",
              "Mobile-friendly design to ensure accessibility on various devices.",
              "Secure upload and storage of audio files."
            ]}
          />
          <FeatureCard
            icon={<FileText className="text-primary w-8 h-8" />}
            title="Text-to-Transcription"
            description="Convert voice feedback into text for easier analysis."
            features={[
              "Utilize AI models to transcribe audio responses in real-time.",
              "Error handling to manage unclear audio inputs."
            ]}
          />
          <FeatureCard
            icon={<SmilePlus className="text-primary w-8 h-8" />}
            title="Sentiment Analysis"
            description="Leverage AI to analyze transcribed text and uncover the sentiment behind user feedback."
            features={[
              "Automatically classify responses as positive, neutral, or negative.",
              "Identify key words and phrases that impact sentiment classification for deeper insights."
            ]}
          />
          <FeatureCard
            icon={<BarChart3 className="text-primary w-8 h-8" />}
            title="Data Visualization"
            description="Present insights in a clear and actionable format."
            features={[
              "Graphs and charts for sentiment distribution, response trends, and survey statistics.",
              "Interactive dashboards for filtering and sorting insights."
            ]}
          />
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
}

const FeatureCard = ({ icon, title, description, features }: FeatureCardProps) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-[#E6F7F1]">
      <div className="flex items-center gap-4 mb-3">
        <div className="p-2 rounded-md bg-[#E6F7F1]">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-slate-600 mb-4">{description}</p>
      <ul className="space-y-3 text-slate-600">
        {features.map((feature, index) => (
          <li key={index}>• {feature}</li>
        ))}
      </ul>
    </div>
  );
};
