import AppHeader from "@/components/AppHeader";
import { Link } from "react-router-dom";
import { ArrowLeft, BookOpen, Cpu, BarChart3, Grid3X3, Rocket } from "lucide-react";

const sections = [
  {
    icon: Cpu,
    title: "Model Training & Evaluation",
    content: `The system employs a hybrid approach combining Convolutional Neural Networks (CNN) and Random Forest classifiers for electricity theft detection. The CNN model is trained on raw consumption data to automatically extract temporal features and patterns indicative of abnormal usage. The Random Forest classifier operates on handcrafted statistical features derived from the same data, providing an ensemble-based classification that is robust to noise and overfitting.

Training is performed on labeled datasets where each record is marked as either normal consumption or theft. The data undergoes preprocessing including normalization, handling of missing values, and feature engineering before being fed to both models independently.`,
  },
  {
    icon: BarChart3,
    title: "Performance Metrics",
    content: `Model evaluation is conducted using standard classification metrics including Accuracy, Precision, Recall, and F1 Score. These metrics are computed on a held-out test set to provide an unbiased estimate of model generalization.

Accuracy measures overall correctness, while Precision quantifies the proportion of predicted theft cases that are truly theft. Recall captures the model's ability to identify all actual theft instances. The F1 Score provides a harmonic mean of Precision and Recall, offering a balanced evaluation metric particularly useful for imbalanced datasets common in theft detection scenarios.`,
  },
  {
    icon: Grid3X3,
    title: "Confusion Matrix Analysis",
    content: `The confusion matrix provides a detailed breakdown of model predictions across both classes. For each model (CNN and Random Forest), a 2×2 matrix displays True Positives (correctly identified theft), True Negatives (correctly identified normal), False Positives (normal misclassified as theft), and False Negatives (theft misclassified as normal).

This analysis is critical for understanding the type and distribution of errors each model makes, enabling targeted improvements and informing the selection of the optimal model for deployment based on the specific operational requirements of the utility company.`,
  },
  {
    icon: Rocket,
    title: "Deployment",
    content: `The trained models are deployed via a Flask-based web application that provides an intuitive interface for utility operators. Users can upload consumption data in CSV format to either train new models or run predictions on unseen data. The system processes the data through both models and presents results with clear visualizations.

The deployment architecture supports model versioning, real-time prediction, and historical result tracking. The web interface is designed to be accessible to non-technical operators while providing detailed metrics for data science teams to monitor model performance over time.`,
  },
];

const ProposedSystem = () => {
  return (
    <div className="min-h-screen bg-background grid-bg">
      <AppHeader />

      <main className="container mx-auto px-6 py-8 max-w-4xl">
        <div className="flex items-center gap-4 mb-10">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-primary" />
              Proposed System
            </h2>
            <p className="text-sm text-muted-foreground">Hybrid CNN–Random Forest Based Electricity Theft Detection</p>
          </div>
        </div>

        <div className="space-y-6">
          {sections.map((section, i) => {
            const Icon = section.icon;
            return (
              <div key={i} className="glass-card rounded-xl p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center border border-primary/20">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold gradient-text">{section.title}</h3>
                </div>
                <div className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line pl-[52px]">
                  {section.content}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default ProposedSystem;
