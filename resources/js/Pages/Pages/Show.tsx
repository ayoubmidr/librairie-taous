import MainLayout from '@/Layouts/MainLayout';

interface PageData {
    id: number;
    title: string;
    slug: string;
    content: string;
    meta_title?: string;
    meta_description?: string;
}

interface ShowProps {
    page: PageData;
}

export default function Show({ page }: ShowProps) {
    return (
        <MainLayout title={page.meta_title || page.title} description={page.meta_description}>
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-4xl font-serif font-bold text-[#0f2b1c] mb-8">{page.title}</h1>
                <div
                    className="prose prose-stone max-w-none leading-relaxed text-stone-600"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </MainLayout>
    );
}
