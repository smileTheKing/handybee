import Image from 'next/image';
import React from 'react';

const listOfjobs = [
  {
    title: 'Web Development',
    description: 'I will create a responsive website using React and Next.js',
    actionText: 'Starting at $50',
    actionLink: '/gig/web-development',
    imageUrl: '/assets/images/web-dev.jpg',
    rating: 4.8
  },
  {
    title: 'Logo Design',
    description: 'Professional logo design with unlimited revisions and source files',
    actionText: 'Starting at $30',
    actionLink: '/gig/logo-design',
    imageUrl: '/assets/images/logo-design.jpg',
    rating: 4.9
  },
  {
    title: 'Content Writing',
    description: 'SEO-optimized blog posts and articles for your website',
    actionText: 'Starting at $25',
    actionLink: '/gig/content-writing',
    imageUrl: '/assets/images/content-writing.jpg',
    rating: 4.7
  },
  {
    title: 'Video Editing',
    description: 'Professional video editing for YouTube and social media',
    actionText: 'Starting at $45',
    actionLink: '/gig/video-editing',
    imageUrl: '/assets/images/video-editing.jpg',
    rating: 4.8
  },
  {
    title: 'Digital Marketing',
    description: 'Full social media marketing and management services',
    actionText: 'Starting at $100',
    actionLink: '/gig/digital-marketing',
    imageUrl: '/assets/images/digital-marketing.jpg',
    rating: 4.6
  },
  {
    title: 'Voice Over',
    description: 'Professional voice over in multiple languages and accents',
    actionText: 'Starting at $20',
    actionLink: '/gig/voice-over',
    imageUrl: '/assets/images/voice-over.jpg',
    rating: 4.9
  },
  {
    title: 'Illustration',
    description: 'Custom digital illustrations and character design',
    actionText: 'Starting at $35',
    actionLink: '/gig/illustration',
    imageUrl: '/assets/images/illustration.jpg',
    rating: 4.8
  },
  {
    title: 'WordPress',
    description: 'Custom WordPress development and site optimization',
    actionText: 'Starting at $60',
    actionLink: '/gig/wordpress',
    imageUrl: '/assets/images/wordpress.jpg',
    rating: 4.7
  }
];

const GigListComponent = () => {
  return (
    <div>
      {/* <HeroComponent/> */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-self-center">
        {
          listOfjobs.map((job,idx)=>{
            return(
              <CardComponent 
                key={idx}
                title={job.title} 
                description={job.description} 
                actionText={job.actionText} 
                actionLink={job.actionLink}
                rating={job.rating}
              />
            );
          })
        }
       
      </div>
    </div>
  )
}

export default GigListComponent;




//  const HeroComponent = () => {
//   return (
//     <div className=''>home-component</div>
//   )
// }

type CardComponentProps = {
  title : string;
  description : string;
  actionText : string;
  actionLink : string;
  rating: number;
  imageUrl?: string;
  onActionClick?: () => void;
}
const CardComponent = (props:CardComponentProps) => {
  return (
    <div className="card w-full md:max-w-[250px]   max-h-[650px] overflow-hidden bg-amiber-400 rounded-lg">
      <div className="flex flex-col">
        {/* image holder */}
      <div className="w-full h-72">
        <Image
          src={props?.imageUrl || "/assets/images/worker.jpg"}
          alt="Hero Image"
          width={500}
          height={500}
           className="rounded-lg"
          priority={true}
          quality={100}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
      </div>
       
        <div className="wrapper flex flex-col justify-between py-4 ">
          <div className="header flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">{props.title}</h2>
              {props.rating && (
                <span className="">
                  ★ {props.rating ? props.rating.toFixed(1) : 'N/A'}
                </span>
              )}
            </div>        
            <p className="text-gray-600 text-sm">{props.description}</p>
             <h2 className="text-lg font-semibold">{props.actionText}</h2>
          </div>
        </div>
      </div>
     
    </div>
  )
}

