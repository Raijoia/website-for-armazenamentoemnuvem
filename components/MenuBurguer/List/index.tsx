import type { listType } from "@/interface/listType";

export default function List({ directory, name }: listType) {
  return (
    <li>
      <a
        href={directory}
        className="block py-2 px-4 text-gray-700 hover:bg-gray-100 rounded"
      >
        {name}
      </a>
    </li>
  )
}