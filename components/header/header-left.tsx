import Link from "next/link";
import { APP_ENG_NAME } from "@/lib/constants";

export default function HeaderLeft() {
  return (
    <h1>
      <Link
        href={"/"}
        className="font-paperlogy text-2xl text-brand block uppercase font-black"
      >
        {APP_ENG_NAME}
      </Link>
    </h1>
  );
}
