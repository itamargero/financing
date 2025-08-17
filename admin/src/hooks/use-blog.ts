import { useApi, useMutation, useOptimisticUpdate } from './use-api'
import { blogApi } from '@/lib/api'
import { BlogPost, BlogCategory } from '@/lib/database'
import { useState, useCallback } from 'react'

export function useBlogPosts(filters?: { status?: string; featured?: boolean; limit?: number }) {
  const { data: posts, loading, error, refetch } = useApi(
    () => blogApi.posts.getAll(filters),
    [filters?.status, filters?.featured, filters?.limit]
  )
  const [localPosts, setLocalPosts] = useState<BlogPost[]>([])
  
  // Update local state when API data changes
  if (posts && localPosts !== posts) {
    setLocalPosts(posts)
  }

  const { optimisticAdd, optimisticUpdate, optimisticRemove } = 
    useOptimisticUpdate(localPosts, setLocalPosts)

  // Mutations
  const createMutation = useMutation(blogApi.posts.create)
  const updateMutation = useMutation(({ id, data }: { id: string; data: Partial<BlogPost> }) =>
    blogApi.posts.update(id, data)
  )
  const deleteMutation = useMutation(blogApi.posts.delete)
  const publishMutation = useMutation(blogApi.posts.publish)
  const unpublishMutation = useMutation(blogApi.posts.unpublish)

  const createPost = useCallback(async (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'author_id'>) => {
    try {
      const newPost = await createMutation.mutate(data)
      optimisticAdd(newPost)
      return newPost
    } catch (error) {
      await refetch()
      throw error
    }
  }, [createMutation, optimisticAdd, refetch])

  const updatePost = useCallback(async (id: string, data: Partial<BlogPost>) => {
    optimisticUpdate(id, data)
    try {
      const updatedPost = await updateMutation.mutate({ id, data })
      return updatedPost
    } catch (error) {
      await refetch()
      throw error
    }
  }, [updateMutation, optimisticUpdate, refetch])

  const deletePost = useCallback(async (id: string) => {
    optimisticRemove(id)
    try {
      await deleteMutation.mutate(id)
    } catch (error) {
      await refetch()
      throw error
    }
  }, [deleteMutation, optimisticRemove, refetch])

  const publishPost = useCallback(async (id: string) => {
    optimisticUpdate(id, { status: 'published', published_at: new Date().toISOString() })
    try {
      const publishedPost = await publishMutation.mutate(id)
      return publishedPost
    } catch (error) {
      await refetch()
      throw error
    }
  }, [publishMutation, optimisticUpdate, refetch])

  const unpublishPost = useCallback(async (id: string) => {
    optimisticUpdate(id, { status: 'draft' })
    try {
      const unpublishedPost = await unpublishMutation.mutate(id)
      return unpublishedPost
    } catch (error) {
      await refetch()
      throw error
    }
  }, [unpublishMutation, optimisticUpdate, refetch])

  return {
    posts: localPosts,
    loading,
    error,
    refetch,
    createPost,
    updatePost,
    deletePost,
    publishPost,
    unpublishPost,
    mutations: {
      create: createMutation,
      update: updateMutation,
      delete: deleteMutation,
      publish: publishMutation,
      unpublish: unpublishMutation,
    }
  }
}

export function useBlogPost(id: string) {
  return useApi(() => blogApi.posts.getById(id), [id])
}

export function useBlogCategories() {
  const { data: categories, loading, error, refetch } = useApi(blogApi.categories.getAll)
  const [localCategories, setLocalCategories] = useState<BlogCategory[]>([])
  
  // Update local state when API data changes
  if (categories && localCategories !== categories) {
    setLocalCategories(categories)
  }

  const { optimisticAdd } = useOptimisticUpdate(localCategories, setLocalCategories)

  const createMutation = useMutation(blogApi.categories.create)

  const createCategory = useCallback(async (data: Omit<BlogCategory, 'id' | 'created_at'>) => {
    try {
      const newCategory = await createMutation.mutate(data)
      optimisticAdd(newCategory)
      return newCategory
    } catch (error) {
      await refetch()
      throw error
    }
  }, [createMutation, optimisticAdd, refetch])

  return {
    categories: localCategories,
    loading,
    error,
    refetch,
    createCategory,
    mutations: {
      create: createMutation,
    }
  }
}