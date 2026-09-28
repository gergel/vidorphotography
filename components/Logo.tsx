export default function Logo({ size = 'sm' }: { size?: 'sm' | 'lg' }) {
  return (
    <span className="inline-flex flex-col leading-none">
      <span className={`font-sans font-semibold tracking-[0.01em] ${size === 'lg' ? 'text-[22px]' : 'text-[18px]'}`}>VIDOR</span>
      <span className="mt-[5px] text-[9px] font-semibold tracking-[0.08em] opacity-80">PHOTO &amp; FILM</span>
    </span>
  );
}
