import Image from "next/image";

const CardArticle = () => {
  return (
    <article className="bg-white shadow-md rounded-lg overflow-hidden">
      <Image
        src={require("@/public/images/image1.jpg")}
        alt="Article 1"
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-xl font-semibold mb-4">Article Title 1</h3>
        <p className="text-gray-700 mb-4">
          A brief summary of the first article goes here. It should be concise
          and engaging to entice readers to click through.
        </p>
        <a
          href="#"
          className="text-indigo-600 hover:text-indigo-400 font-medium"
        >
          Read More →
        </a>
      </div>
    </article>
  );
};
export default CardArticle;
