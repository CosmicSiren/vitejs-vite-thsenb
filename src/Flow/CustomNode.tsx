import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Node } from './layoutStrategies/types';

const backgroundColors = [
  'bg-violet-100',
  'bg-red-100',
  'bg-orange-100',
  'bg-yellow-100',
  'bg-lime-100',
  'bg-sky-100',
  'bg-pink-100',
  'bg-fuchsia-100',
  'bg-purple-100',
];
const totalColorsCount = backgroundColors.length;

function CustomNode({ id, data }: Node) {
  const bgClass = backgroundColors[(data?.group || 0) % totalColorsCount];
  console.log(bgClass, data);
  return (
    <div
      className={`w-fit h-fit group px-4 py-2 flex flex-col gap-2 justify-start items-start shadow-md rounded-md border-2 border-stone-400 ${bgClass} transition-all duration-300 ease-in-out`}
    >
      <div className="flex flex-row gap-2 justify-center items-center">
        <p className="bg-white w-6 h-6 flex justify-center items-center border border-solid border-black/30 rounded-full font-normal text-xs text-black">
          {data?.group}
        </p>
        <p> - </p>
        <p className="font-semibold">{id}</p>
      </div>
      <p className="w-32 group-hover:block hidden font-normal text-sm whitespace-wrap transition-all duration-300 ease-in-out">
        {(data?.label || '').replace(/_/g, ' ')}
      </p>
      <Handle type="target" position={Position.Top} className="" />
      <Handle type="source" position={Position.Bottom} className="" />
    </div>
  );
}

export default memo(CustomNode);
