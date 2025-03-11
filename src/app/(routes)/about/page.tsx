// src/app/about/page.tsx
// Direct migration of your existing about page
import SectionContainer from '@/components/SectionContainer';

export default function AboutPage() {
  return (
    <SectionContainer>
      <div className="divide-y divide-accent-foreground dark:divide-accent">
        <div className="space-y-2 pb-8 pt-6 md:space-y-5">
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight text-foreground sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">
            About
          </h1>
        </div>
        <div className="items-start space-y-2 xl:grid xl:grid-cols-3 xl:gap-x-8 xl:space-y-0">
          <div className="prose prose-lg max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2">
            {/* Your about content here */}
            <p>
              Full-stack developer, creative, and student passionate about building innovative web experiences.
            </p>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
}