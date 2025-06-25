"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { X, Plus, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface PackageInput {
    name: string;
    description: string;
    price: number;
    deliveryTime: number;
    revisions: number;
    features: string[];
}

interface GigSubmitFormData {
    title: string;
    category: string;
    description: string;
    skills: string[];
    packages: PackageInput[];
}

interface GigSubmitFormProps {
    gig?: Partial<GigSubmitFormData> & { id?: string; images?: string[]; sellerId?: string };
    isEdit?: boolean;
}

const PACKAGE_LABELS = ['Basic', 'Standard', 'Premium'];

const GigSubmitForm = ({ gig, isEdit }: GigSubmitFormProps) => {
    const [skills, setSkills] = useState<string[]>(gig?.skills || []);
    const [packages, setPackages] = useState<PackageInput[]>([
        {
            name: '',
            description: '',
            price: 5.0,
            deliveryTime: 1,
            revisions: 1,
            features: [],
        },
    ]);
    const [featureInputs, setFeatureInputs] = useState<string[]>(
        gig?.packages ? gig.packages.map(pkg => pkg.features.join(', ')) : packages.map(() => '')
    );
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const { register, handleSubmit, formState: { errors }, reset } = useForm<GigSubmitFormData>({
        defaultValues: {
            title: gig?.title || '',
            category: gig?.category || '',
            description: gig?.description || '',
            skills: gig?.skills || [],
            packages: gig?.packages || [
                {
                    name: '',
                    description: '',
                    price: 5,
                    deliveryTime: 1,
                    revisions: 1,
                    features: [],
                },
            ],
        },
    });
    const router = useRouter();

    useEffect(() => {
        if (gig) {
            reset({
                title: gig.title || '',
                category: gig.category || '',
                description: gig.description || '',
                skills: gig.skills || [],
                packages: gig.packages || [
                    {
                        name: '',
                        description: '',
                        price: 5,
                        deliveryTime: 1,
                        revisions: 1,
                        features: [],
                    },
                ],
            });
            setSkills(gig.skills || []);
            setPackages(gig.packages || [
                {
                    name: '',
                    description: '',
                    price: 5,
                    deliveryTime: 1,
                    revisions: 1,
                    features: [],
                },
            ]);
            setFeatureInputs(gig.packages ? gig.packages.map(pkg => pkg.features.join(', ')) : ['']);
        }
    }, [gig, reset]);

    const onSubmit = async (data: GigSubmitFormData) => {
        let imageUrls: string[] = [];
        if (selectedImages.length > 0) {
            const formData = new FormData();
            selectedImages.forEach((file) => formData.append('images', file));
            const uploadRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });
            if (uploadRes.ok) {
                const uploadData = await uploadRes.json();
                imageUrls = uploadData.urls;
            } else {
                alert('Image upload failed');
                return;
            }
        }
        const formData = {
            ...data,
            skills,
            packages,
            images: imageUrls,
        };
        try {
            if (isEdit && gig?.id) {
                // Edit mode: PUT request
                const res = await fetch(`/api/gigs/${gig.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    router.push(`/gigs/${gig.id}`);
                } else {
                    alert('Failed to update gig');
                }
            } else {
                // Create mode: POST request
                const res = await fetch('/api/gigs', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData),
                });
                if (res.ok) {
                    const newGig = await res.json();
                    router.push(`/gigs/${newGig.id}`);
                } else {
                    alert('Failed to create gig');
                }
            }
        } catch {
            alert('An error occurred');
        }
    };

    const handleSkillAdd = (skill: string) => {
        if (skill && !skills.includes(skill)) {
            setSkills([...skills, skill]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setSelectedImages(files);
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="space-y-2">
                <label className="block text-sm font-medium">Gig Title</label>
                <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full p-2 border rounded-md"
                    placeholder="I will..."
                />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Category</label>
                <select
                    {...register('category', { required: 'Category is required' })}
                    className="w-full p-2 border rounded-md"
                >
                    <option value="">Select a category</option>
                    <option value="design">Design</option>
                    <option value="development">Development</option>
                    <option value="writing">Writing</option>
                    <option value="marketing">Marketing</option>
                </select>
                {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Description</label>
                <textarea
                    {...register('description', { required: 'Description is required' })}
                    className="w-full p-2 border rounded-md h-32"
                    placeholder="Describe your gig in detail..."
                />
                {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Packages</label>
                <p className="text-gray-600 text-sm mb-4 flex items-center gap-2"><Info className="w-4 h-4" />Add up to 3 packages. Suggest different tiers for your service.</p>
                {packages.map((pkg, idx) => (
                    <div key={idx} className="border-2 border-blue-200 bg-blue-50 p-4 rounded-xl mb-6 shadow-sm relative">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-semibold text-blue-700 text-base">
                                {PACKAGE_LABELS[idx] || `Package ${idx + 1}`}
                            </span>
                            {packages.length > 1 && (
                                <button type="button" onClick={() => {
                                    setPackages(packages.filter((_, i) => i !== idx));
                                    setFeatureInputs(featureInputs.filter((_, i) => i !== idx));
                                }} className="text-red-500 hover:bg-red-100 rounded-full p-1" title="Remove Package">
                                    <X className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <input
                            className="w-full p-2 border rounded-md mb-2 font-semibold"
                            placeholder="Package Name"
                            value={pkg.name ?? ''}
                            onChange={e => {
                                const newPkgs = [...packages];
                                newPkgs[idx].name = e.target.value;
                                setPackages(newPkgs);
                            }}
                            required
                        />
                        <textarea
                            className="w-full p-2 border rounded-md mb-2"
                            placeholder="Description"
                            value={pkg.description ?? ''}
                            onChange={e => {
                                const newPkgs = [...packages];
                                newPkgs[idx].description = e.target.value;
                                setPackages(newPkgs);
                            }}
                            required
                        />
                        <div className="flex gap-2 mb-2 flex-wrap">
                            <div className="flex-1 min-w-[100px]">
                                <label className="block text-xs font-medium mb-1">Price ($)</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Price"
                                    value={pkg.price ?? ''}
                                    min={5}
                                    onChange={e => {
                                        const newPkgs = [...packages];
                                        newPkgs[idx].price = Number(e.target.value);
                                        setPackages(newPkgs);
                                    }}
                                    required
                                />
                            </div>
                            <div className="flex-1 min-w-[100px]">
                                <label className="block text-xs font-medium mb-1">Delivery Days</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Delivery Days"
                                    value={pkg.deliveryTime ?? ''}
                                    min={1}
                                    onChange={e => {
                                        const newPkgs = [...packages];
                                        newPkgs[idx].deliveryTime = Number(e.target.value);
                                        setPackages(newPkgs);
                                    }}
                                    required
                                />
                            </div>
                            <div className="flex-1 min-w-[100px]">
                                <label className="block text-xs font-medium mb-1">Revisions</label>
                                <input
                                    type="number"
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Revisions"
                                    value={pkg.revisions ?? ''}
                                    min={1}
                                    onChange={e => {
                                        const newPkgs = [...packages];
                                        newPkgs[idx].revisions = Number(e.target.value);
                                        setPackages(newPkgs);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="block text-xs font-medium mb-1">Features</label>
                            <div className="flex gap-2 flex-wrap mb-2">
                                {pkg.features.map((feature, fidx) => (
                                    <span key={fidx} className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                                        {feature}
                                        <button type="button" onClick={() => {
                                            const newPkgs = [...packages];
                                            newPkgs[idx].features = newPkgs[idx].features.filter((_, i) => i !== fidx);
                                            setPackages(newPkgs);
                                        }} className="ml-1 text-blue-900 hover:text-red-500">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <input
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Add a feature and press Enter"
                                    value={featureInputs[idx] ?? ''}
                                    onChange={e => {
                                        const newInputs = [...featureInputs];
                                        newInputs[idx] = e.target.value;
                                        setFeatureInputs(newInputs);
                                    }}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter' && featureInputs[idx]?.trim()) {
                                            e.preventDefault();
                                            const newPkgs = [...packages];
                                            if (!newPkgs[idx].features.includes(featureInputs[idx].trim())) {
                                                newPkgs[idx].features.push(featureInputs[idx].trim());
                                                setPackages(newPkgs);
                                            }
                                            const newInputs = [...featureInputs];
                                            newInputs[idx] = '';
                                            setFeatureInputs(newInputs);
                                        }
                                    }}
                                    maxLength={40}
                                />
                                <button type="button" onClick={() => {
                                    if (featureInputs[idx]?.trim()) {
                                        const newPkgs = [...packages];
                                        if (!newPkgs[idx].features.includes(featureInputs[idx].trim())) {
                                            newPkgs[idx].features.push(featureInputs[idx].trim());
                                            setPackages(newPkgs);
                                        }
                                        const newInputs = [...featureInputs];
                                        newInputs[idx] = '';
                                        setFeatureInputs(newInputs);
                                    }
                                }} className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600 flex items-center gap-1">
                                    <Plus className="w-4 h-4" />
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            if (packages.length < 3) {
                                setPackages([...packages, { name: PACKAGE_LABELS[packages.length] || '', description: '', price: 5, deliveryTime: 1, revisions: 1, features: [] }]);
                                setFeatureInputs([...featureInputs, '']);
                            }
                        }}
                        className={`flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md shadow hover:bg-green-600 transition-colors ${packages.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={packages.length >= 3}
                        title={packages.length >= 3 ? 'Maximum 3 packages allowed' : 'Add another package'}
                    >
                        <Plus className="w-5 h-5" /> Add Package
                    </button>
                </div>
                {packages.length >= 3 && (
                    <p className="text-xs text-gray-500 mt-1">Maximum 3 packages allowed.</p>
                )}
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Skills</label>
                <div className="flex gap-2 flex-wrap">
                    {skills.map((skill, index) => (
                        <span
                            key={index}
                            className="bg-blue-100 px-2 py-1 rounded-md text-sm"
                        >
                            {skill}
                            <button
                                type="button"
                                onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                                className="ml-2 text-red-500"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <input
                    type="text"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleSkillAdd((e.target as HTMLInputElement).value);
                            (e.target as HTMLInputElement).value = '';
                        }
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Press Enter to add skills"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium">Gig Images</label>
                <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                />
                {imagePreviews.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                        {imagePreviews.map((src, idx) => (
                            <img key={idx} src={src} alt={`Preview ${idx + 1}`} className="w-24 h-24 object-cover rounded border" />
                        ))}
                    </div>
                )}
            </div>

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
            >
                Submit Gig
            </button>
        </form>
    );
};

export default GigSubmitForm;