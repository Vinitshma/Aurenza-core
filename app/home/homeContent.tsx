import { Button } from "@/components/ui/button";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import Link from "next/link";

export default function HomeContent() {
  return (
    <>
      <div className="min-h-screen flex">
        <div className="w-1/2 flex items-center justify-center">
          <div className="max-w-lg">
            <h1 className="text-3xl font-bold leading-snug">
              Master Knowledge. <br />
              Elevate Care.
            </h1>

            <p className="text-gray-700 pt-2">
              At Aurenza, we believe technology should not only heal it shuld teach, empower,and inspire. 
              We're building a bridge between medical innovation and human understanding, making healthcare 
              smarter,more accessible, and deeply personal.
            </p>

            <Link href="/anatomy">
              <Button className="mt-2" variant="outline" size="sm">
                Explore Anatomy
                <IconArrowNarrowRight className="rotate-320" stroke={2} />
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-1/2 flex items-center justify-center">
          {/* <h1 className="text-3xl font-bold">Right Side (50%)</h1> */}
          <div
            className="flex items-center justify-center"
            style={{ height: "65%", width: "60%", background: "#c2bfbf45" }}
          >
            <img
              src="../../anatomy_figure_img.jpg"
              className="mix-blend-darken"
              alt="anatoy_img"
            />
          </div>
        </div>
      </div>
    </>
  );
}
