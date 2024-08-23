import Image from "next/image";

const CardArticle = () => {
  return (
    <section className="p-8 bg-[#fffac0] text-white">
      {/* <h3 className="text-3xl font-bold mb-6">最新文章</h3> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Article 1 */}
        <article className="bg-white shadow-md rounded-lg overflow-hidden">
          <Image
            src={require("../../data/images/image1.jpg")}
            alt="Article 1"
            className="w-full h-48 object-cover"
          />
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">Article Title 1</h3>
            <p className="text-gray-700 mb-4">
              A brief summary of the first article goes here. It should be
              concise and engaging to entice readers to click through.
            </p>
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-400 font-medium"
            >
              Read More →
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};
export default CardArticle;
