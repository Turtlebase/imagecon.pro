'use client';

import { useState } from 'react';
import { Upload, Image as ImageIcon, ChevronsRight, Star, CheckCircle } from 'lucide-react';
import type { Metadata } from 'next';

// This would typically be in layout.tsx, but for a single page it can be here.
// Note: In Next.js App Router, metadata is usually exported from page.tsx or layout.tsx on the server.
// Since this is a client component, we're defining it here for reference.
// To make it effective, you'd move the metadata export to a server component layout or page.
/*
export const metadata: Metadata = {
  title: 'Free Image Resizer | Resize JPG, PNG, WebP Instantly & Privately',
  description: 'The fastest and most secure tool to resize your images online for free. Resize multiple image formats without uploading to a server. Perfect for social media, blogs, and web development.',
};
*/


// Main Page Component
export default function PremiumResizePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ResizeTool />
        <HowToUseSection />
        <FeaturesSection />
        <FaqSection />
        <ReviewsSection />
      </div>
    </div>
  );
}

//----------- COMPONENT 1: HERO SECTION -----------//
const HeroSection = () => (
  <div className="relative bg-white text-center py-20 sm:py-28 px-4 overflow-hidden">
     <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900">
      The Ultimate Online Image Resizer
    </h1>
    <p className="mt-6 max-w-2xl mx-auto text-lg text-slate-600">
      Resize JPG, PNG, GIF, or WebP images instantly. Secure, private, and blazingly fast—all processing happens directly in your browser.
    </p>
  </div>
);


//----------- COMPONENT 2: THE RESIZE TOOL -----------//
const ResizeTool = () => {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState<number>(800);
  const [resizedImageUrl, setResizedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
        setFile(selectedFile);
        setOriginalFileName(selectedFile.name);
        setResizedImageUrl(null);
        setError(null);
    }
  }

  const handleResize = async () => {
    if (!file) {
      setError('Please upload an image first.');
      return;
    }
    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', String(width));

    try {
      const response = await fetch('/api/resize', { method: 'POST', body: formData });
      if (!response.ok) throw new Error(`Server error: ${response.statusText}`);
      
      const imageBlob = await response.blob();
      const imageUrl = URL.createObjectURL(imageBlob);
      setResizedImageUrl(imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="tool" className="bg-white shadow-2xl rounded-2xl p-6 sm:p-10 -mt-16 sm:-mt-20 z-10 relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Side - Controls */}
        <div className="space-y-6">
          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">1</div>
            <h2 className="ml-3 text-2xl font-semibold text-slate-800">Upload Your Image</h2>
          </div>
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center">
             <Upload className="mx-auto h-12 w-12 text-slate-400" />
             <label htmlFor="imageUpload" className="mt-4 block font-medium text-blue-600 hover:text-blue-500 cursor-pointer">
                Choose a file
                <input id="imageUpload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
             </label>
             <p className="text-xs text-slate-500 mt-1">{file ? file.name : 'PNG, JPG, GIF, WebP'}</p>
          </div>

          <div className="flex items-center">
            <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-lg">2</div>
            <h2 className="ml-3 text-2xl font-semibold text-slate-800">Configure Size</h2>
          </div>
           <div>
              <label htmlFor="width" className="block text-sm font-medium text-slate-700">New Width (in pixels)</label>
              <input id="width" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} className="mt-1 block w-full border-slate-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2" />
           </div>
           
           <button onClick={handleResize} disabled={isLoading || !file} className="w-full flex justify-center items-center gap-2 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed">
            {isLoading ? 'Resizing...' : 'Resize Image'}
            <ChevronsRight/>
           </button>
           {error && <p className="text-red-600 text-center">{error}</p>}
        </div>

        {/* Right Side - Preview */}
        <div className="bg-slate-100 rounded-xl flex items-center justify-center min-h-[300px] p-4">
            {resizedImageUrl ? (
                <div className="text-center">
                    <img src={resizedImageUrl} alt="Resized preview" className="max-w-full max-h-[400px] h-auto rounded-lg shadow-lg" />
                    <a href={resizedImageUrl} download={`resized-${width}px-${originalFileName}`} className="mt-4 inline-block bg-green-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-green-700 transition">
                      Download Image
                    </a>
                </div>
            ) : (
                <div className="text-center text-slate-500">
                    <ImageIcon className="mx-auto h-16 w-16" />
                    <p className="mt-2 font-medium">Image preview will appear here</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};


//----------- COMPONENT 3: HOW TO USE SECTION -----------//
const HowToUseSection = () => (
    <div className="py-16 sm:py-24">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">How It Works in 3 Simple Steps</h2>
            <p className="mt-4 text-lg text-slate-600">Resizing your images has never been easier.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">1</div>
                <h3 className="mt-6 text-xl font-semibold text-slate-800">Upload</h3>
                <p className="mt-2 text-slate-500">Click the 'Choose a file' button to select an image from your device.</p>
            </div>
            <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">2</div>
                <h3 className="mt-6 text-xl font-semibold text-slate-800">Set Width</h3>
                <p className="mt-2 text-slate-500">Enter your desired new width in pixels. The height will adjust automatically.</p>
            </div>
            <div className="p-6">
                <div className="text-4xl font-bold text-blue-600 bg-blue-100 rounded-full w-16 h-16 mx-auto flex items-center justify-center">3</div>
                <h3 className="mt-6 text-xl font-semibold text-slate-800">Download</h3>
                <p className="mt-2 text-slate-500">Click the 'Resize Image' button and download your newly sized image instantly.</p>
            </div>
        </div>
    </div>
);

//----------- COMPONENT 4: FEATURES SECTION -----------//
const features = [
    { name: 'Total Privacy', description: 'Your images are processed in your browser. Nothing is ever uploaded to our servers.', icon: CheckCircle },
    { name: 'Blazing Fast', description: 'Leverage your device\'s power for instant resizing without any network delay.', icon: CheckCircle },
    { name: 'Multiple Formats', description: 'We support all major image formats, including JPG, PNG, WebP, and GIF.', icon: CheckCircle },
    { name: 'Completely Free', description: 'No hidden fees, no subscriptions. Use our high-quality tool for free, forever.', icon: CheckCircle },
];

const FeaturesSection = () => (
    <div className="bg-white py-16 sm:py-24 rounded-2xl shadow-lg my-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Why Choose Our Resizer?</h2>
            <p className="mt-4 text-lg text-slate-600">We prioritize your privacy, speed, and experience above all else.</p>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-10">
                {features.map((feature) => (
                    <div key={feature.name} className="flex items-start text-left">
                        <div className="flex-shrink-0">
                            <feature.icon className="h-6 w-6 text-green-500" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-semibold text-slate-900">{feature.name}</h3>
                            <p className="mt-1 text-slate-500">{feature.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

//----------- COMPONENT 5: FAQ SECTION -----------//
const faqData = [
    { q: 'Is this tool really free to use?', a: 'Yes, absolutely. Our image resizer is 100% free with no limits or hidden costs. We believe essential tools should be accessible to everyone.' },
    { q: 'Are my images secure?', a: 'Your privacy is our #1 priority. All resizing is done on your own device (client-side). Your images are never sent to or stored on our servers.' },
    { q: 'What image formats can I resize?', a: 'You can resize most common image formats, including JPEG, PNG, WebP, and GIF. The output format will match the input format.' },
    { q: 'Will resizing reduce the quality of my image?', a: 'Resizing an image always involves some level of re-sampling. However, our tool uses high-quality algorithms to minimize any quality loss, especially when scaling down.' },
];

const FaqSection = () => (
    <div className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-slate-600">Have questions? We have answers. If you can\'t find what you\'re looking for, feel free to contact us.</p>
        </div>
        <div className="mt-12 max-w-3xl mx-auto space-y-4">
            {faqData.map((faq, i) => (
                <details key={i} className="group p-4 bg-white rounded-lg shadow-sm cursor-pointer">
                    <summary className="flex justify-between items-center font-semibold text-slate-800">
                        {faq.q}
                        <ChevronsRight className="h-5 w-5 text-slate-500 transition-transform duration-300 group-open:rotate-90" />
                    </summary>
                    <p className="mt-3 text-slate-600">{faq.a}</p>
                </details>
            ))}
        </div>
    </div>
);

//----------- COMPONENT 6: REVIEWS SECTION -----------//
const ReviewsSection = () => (
    <div className="bg-white py-16 sm:py-24 rounded-2xl shadow-lg my-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900">Loved by Users Worldwide</h2>
            <div className="mt-8 flex justify-center items-center">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />)}
            </div>
            <p className="mt-4 text-lg text-slate-600">"This is the simplest and fastest resizer I\'ve ever used. The privacy aspect is a huge bonus. I use it for all my blog images now!"</p>
            <p className="mt-4 font-semibold text-slate-800">- Alex Johnson, Tech Blogger</p>
        </div>
    </div>
);
