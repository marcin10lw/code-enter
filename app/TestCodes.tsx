import CopyButton from "./CopyButton";

const TestCodes = () => {
  return (
    <section className="w-full rounded-md bg-slate-800 p-6 text-slate-200">
      <h2 className="text-xl">Testing codes</h2>
      <p className="mt-2 text-sm">
        Here you can find example codes to test copy paste functionality
      </p>
      <ul className="mt-2 list-disc pl-8">
        <li>
          <div className="flex items-center gap-1.5">
            <span>1234</span> <CopyButton />
          </div>{" "}
          -
        </li>
      </ul>
    </section>
  );
};

export default TestCodes;
