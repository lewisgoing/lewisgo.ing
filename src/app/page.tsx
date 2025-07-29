import Bento from '@/components/features/bento/Bento';

export default function Home() {
  return (
    <div className="divide-y divide-accent-foreground dark:divide-accent">
      <div className="mx-auto bento-md:-mx-[5vw] bento-lg:-mx-[20vw]">
        <Bento />
      </div>
    </div>
  );
}
