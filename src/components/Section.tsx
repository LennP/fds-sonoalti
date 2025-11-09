// Section.tsx
import React from "react";

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const Section = ({ title, icon, children }: SectionProps) => (
  <div className="pb-4 border-b">
    <div className="flex items-center justify-center bg-gray-200 p-2 select-none">
      {icon}
      <h2 className="text-xl font-bold ml-2">{title}</h2>
    </div>
    {children}
  </div>
);

export default Section;
