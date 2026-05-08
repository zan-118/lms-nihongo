import React from "react";

export const ptBlock = {
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-3xl md:text-5xl font-black text-foreground mt-16 md:mt-24 mb-8 md:mb-10 uppercase tracking-tighter flex items-center gap-4 group">
      <span className="w-2 h-10 md:h-12 bg-gradient-to-b from-primary to-emerald-500 rounded-full shadow-[0_0_15px_rgba(0,238,255,0.4)]" />
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xl md:text-2xl font-black text-primary mt-12 md:mt-16 mb-4 md:mb-6 uppercase tracking-[0.2em] flex items-center gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
      {children}
    </h3>
  ),
  normal: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-muted-foreground text-sm md:text-lg leading-[1.8] md:leading-[2] mb-6 md:mb-8 font-medium">
      {children}
    </p>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary/30 pl-6 italic text-muted-foreground/80 my-8">
      {children}
    </blockquote>
  ),
};

export const ptList = {
  bullet: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-4 md:space-y-6 mb-8 md:mb-12 list-none">
      {children}
    </ul>
  ),
};

export const ptListItem = {
  bullet: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-4 md:gap-5 group">
      <div className="mt-2.5 w-1.5 md:w-2 h-1.5 md:h-2 rounded-full bg-primary/30 group-hover:bg-primary group-hover:scale-125 transition-all shadow-[0_0_10px_rgba(0,238,255,0)] group-hover:shadow-[0_0_10px_rgba(0,238,255,0.5)]" />
      <div className="flex-1 text-muted-foreground text-sm md:text-lg leading-relaxed font-medium group-hover:text-foreground transition-colors">
        {children}
      </div>
    </li>
  ),
};
