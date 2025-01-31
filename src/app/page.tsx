import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <p>
        If you are looking for the meal planner, go{" "}
        <Link href="/meal-planner">here</Link>.
      </p>
    </div>
  );
}
