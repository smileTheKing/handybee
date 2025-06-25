import Link from "next/link";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
     

     <main className="flex-1 flex  items-center justify-center p-6 flex-col gap-2">
          <h1 className="font-bold font-serif text-2xl">W E L C O M E . TO . H A N D Y . B E E</h1>
         <h1 className="font-bold font-serif text-lg">A . I</h1>
         
         <Link href={"/l"}>Start Right Here</Link>
     </main>
    </div>
  );
}
