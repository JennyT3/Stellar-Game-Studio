import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NeonButtonProps {
  children: React.ReactNode;
  size?: 'default' | 'lg';
  variant?: 'default' | 'outline';
  className?: string;
  onClick?: () => void;
}

export function NeonButton({ 
  children, 
  size = 'default', 
  variant = 'default',
  className,
  onClick 
}: NeonButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "relative overflow-hidden font-display font-bold tracking-wider transition-all duration-300",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-[#00ff80] before:to-[#6c1b9e] before:opacity-0 before:transition-opacity before:duration-300 hover:before:opacity-20",
        variant === 'default' && "bg-[#00ff80] text-black hover:bg-[#00cc66] hover:shadow-[0_0_20px_rgba(0,255,128,0.5)]",
        variant === 'outline' && "border-2 border-[#00ff80] text-[#00ff80] bg-transparent hover:bg-[#00ff80]/10 hover:shadow-[0_0_20px_rgba(0,255,128,0.3)]",
        size === 'lg' && "px-8 py-6 text-lg",
        className
      )}
    >
      {children}
    </Button>
  );
}
