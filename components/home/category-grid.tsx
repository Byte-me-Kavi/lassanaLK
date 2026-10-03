import { SectionHeading } from "@/components/ui/section-heading";
import { CategoryCard } from "@/components/product/category-card";

const CATEGORIES = [
  {
    name: "Name Pendants",
    slug: "name-pendants",
    description: "Wear your name with pride in beautiful script.",
    imageUrl: "/placeholder.jpg",
  },
  {
    name: "Rings",
    slug: "rings",
    description: "Timeless bands and elegant statement pieces.",
    imageUrl: "/placeholder.jpg",
  },
  {
    name: "Earrings",
    slug: "earrings",
    description: "From delicate studs to stunning drops.",
    imageUrl: "/placeholder.jpg",
  },
  {
    name: "Bracelets",
    slug: "bracelets",
    description: "The perfect touch for your wrist.",
    imageUrl: "/placeholder.jpg",
  }
];

export function CategoryGrid() {
  return (
    <section className="section-padding bg-brand-cream">
      <div className="container-main">
        <SectionHeading
          title="Shop by Category"
          subtitle="Explore our collections to find the perfect piece for any occasion."
        />
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          {CATEGORIES.map((cat) => (
            <CategoryCard
              key={cat.slug}
              name={cat.name}
              slug={cat.slug}
              description={cat.description}
              imageUrl={cat.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
