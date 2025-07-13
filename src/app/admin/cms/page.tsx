
'use client';
import { AdminLayout } from '@/components/admin/admin-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function AdminCmsPage() {
  return (
    <AdminLayout>
      <main className="flex-1 space-y-6 p-4 md:p-8">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">News & Announcements</h1>
          <Button>View Published Posts</Button>
        </div>
        
        <Card>
            <CardHeader>
                <CardTitle>Create New Post</CardTitle>
                <CardDescription>Write a new article to be published on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
                <form className="space-y-4">
                    <div>
                        <label htmlFor="post-title" className="block text-sm font-medium text-gray-700">Post Title</label>
                        <Input id="post-title" placeholder="e.g. Important Update on Visa Processing Times" />
                    </div>
                     <div>
                        <label htmlFor="post-content" className="block text-sm font-medium text-gray-700">Content</label>
                        <Textarea id="post-content" placeholder="Write your article content here..." rows={10} />
                    </div>
                    <Button type="submit">Publish Post</Button>
                </form>
            </CardContent>
        </Card>
      </main>
    </AdminLayout>
  );
}
