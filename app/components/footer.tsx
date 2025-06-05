export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f9fafb",
        color: "black",
        borderRadius: "5px",
      }}
      className=" text-white py-1 fixed z-10  w-full bottom-0 "
      // className="relative w-full py-2  text-black mt-auto bottom-0"
      // className="w-full py-2 text-black"
    >
      <div className="container  text-center">
        <p className="mb-2">
          &copy; 2024{" "}
          <a
            href="mailto:patitracker@email.com"
            className="text-green-600 hover:underline"
          >
            Patitracker
          </a>
          . All rights reserved
        </p>
      </div>
    </footer>
  );
}
