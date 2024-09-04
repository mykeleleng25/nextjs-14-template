'use client'
import { z } from 'zod'
import { useState, useEffect } from 'react'

import { format } from 'date-fns'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'

import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useToast } from '@/hooks/use-toast'

import { Check, ChevronsUpDown, CalendarIcon } from 'lucide-react'

const formSchema = z.object({
	username: z.string().min(2).max(50),
	language: z.string({
		required_error: 'Please select a language.',
	}),
	search: z.string({
		required_error: 'Please select option.',
	}),
	dob: z.date({
		required_error: 'A date of birth is required.',
	}),
	type: z.enum(["all", "mentions", "none"], {
		required_error: "You need to select a notification type.",
	}),
	mobile: z.boolean().default(false),
})

const languages = [
	{ label: 'English', value: 'en' },
	{ label: 'French', value: 'fr' },
	{ label: 'German', value: 'de' },
	{ label: 'Spanish', value: 'es' },
	{ label: 'Portuguese', value: 'pt' },
	{ label: 'Russian', value: 'ru' },
	{ label: 'Japanese', value: 'ja' },
	{ label: 'Korean', value: 'ko' },
	{ label: 'Chinese', value: 'zh' },
] as const

const cats = ['Siamese', 'British Shorthair', 'Maine Coon', 'Persian', 'Ragdoll', 'Sphynx']
const dogs = [
	'German Shepherd',
	'Bulldog',
	'Labrador Retriever',
	'Golden Retriever',
	'French Bulldog',
	'Siberian Husky',
]

const mockApiSearch = (searchQuery: string): Promise<string[]> => {
	return new Promise((resolve) => {
		setTimeout(() => {
			const lookingForCats = searchQuery.includes('cat')
			const lookingForDogs = searchQuery.includes('dog')
			if (lookingForCats && lookingForDogs) {
				resolve([...cats, ...dogs])
			} else if (lookingForCats) {
				resolve(cats)
			} else if (lookingForDogs) {
				resolve(dogs)
			} else {
				resolve([])
			}
		}, 500) // Adjust the timeout duration as needed
	})
}

export default function FormPage() {
	const [commandInput, setCommandInput] = useState<string>('')
	const [results, setResults] = useState<string[]>([])
	const { toast } = useToast()
	useEffect(() => {
		mockApiSearch(commandInput).then((e) => setResults(e))
		// setResults()
	}, [commandInput])

	// 1. Define your form.
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: '',
			mobile: false,
		},
	})

	// 2. Define a submit handler.
	function onSubmit(values: z.infer<typeof formSchema>) {
		// Do something with the form values.
		// ✅ This will be type-safe and validated.
		toast({
			title: 'You submitted the following values:',
			description: (
				<pre className='mt-2 w-[340px] rounded-md bg-slate-950 p-4'>
					<code className='text-white'>{JSON.stringify(values, null, 2)}</code>
				</pre>
			),
		})
		console.log(values)
	}

	return (
		<div className='container mx-auto py-10'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder='shadcn' {...field} />
								</FormControl>
								<FormDescription>This is your public display name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='language'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Language</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant='outline'
												role='combobox'
												className={cn(
													'justify-between',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value
													? languages.find((language) => language.value === field.value)
															?.label
													: 'Select language'}
												<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className='p-0'>
										<Command>
											<CommandInput placeholder='Search language...' />
											<CommandEmpty>No language found.</CommandEmpty>
											<CommandGroup>
												{languages.map((language) => (
													<CommandItem
														value={language.label}
														key={language.value}
														onSelect={() => {
															form.setValue('language', language.value)
														}}
													>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																language.value === field.value
																	? 'opacity-100'
																	: 'opacity-0'
															)}
														/>
														{language.label}
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
								<FormDescription>
									This is the language that will be used in the dashboard.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='search'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Searchable</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant='outline'
												role='combobox'
												className={cn(
													'justify-between',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? cats.find((cat) => cat === field.value) : 'Select Cat'}
												<ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className='p-0'>
										<Command className='rounded-lg border shadow-md' shouldFilter={false}>
											<CommandInput
												placeholder="Type 'cat' or 'dog'..."
												value={commandInput}
												onValueChange={setCommandInput}
											/>
											<CommandList>
												<CommandEmpty>
													{commandInput === ''
														? 'Start typing to load results'
														: 'No results found.'}
												</CommandEmpty>
												<CommandGroup>
													{results.map((result: string) => (
														<CommandItem
															key={result}
															value={result}
															onSelect={() => {
																form.setValue('search', result)
															}}
														>
															<Check
																className={cn(
																	'mr-2 h-4 w-4',
																	result === field.value ? 'opacity-100' : 'opacity-0'
																)}
															/>
															{result}
														</CommandItem>
													))}
												</CommandGroup>
											</CommandList>
										</Command>
									</PopoverContent>
								</Popover>
								<FormDescription>
									This is the language that will be used in the dashboard.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='dob'
						render={({ field }) => (
							<FormItem className='flex flex-col'>
								<FormLabel>Date of birth</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={'outline'}
												className={cn(
													'w-[240px] pl-3 text-left font-normal',
													!field.value && 'text-muted-foreground'
												)}
											>
												{field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
												<CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
											</Button>
										</FormControl>
									</PopoverTrigger>
									<PopoverContent className='w-auto p-0' align='start'>
										<Calendar
											mode='single'
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>Your date of birth is used to calculate your age.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="type"
						render={({ field }) => (
							<FormItem className="space-y-3">
								<FormLabel>Notify me about...</FormLabel>
								<FormControl>
									<RadioGroup
										onValueChange={field.onChange}
										defaultValue={field.value}
										className="flex flex-col space-y-1"
									>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="all" />
											</FormControl>
											<FormLabel className="font-normal">
												All new messages
											</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="mentions" />
											</FormControl>
											<FormLabel className="font-normal">
												Direct messages and mentions
											</FormLabel>
										</FormItem>
										<FormItem className="flex items-center space-x-3 space-y-0">
											<FormControl>
												<RadioGroupItem value="none" />
											</FormControl>
											<FormLabel className="font-normal">Nothing</FormLabel>
										</FormItem>
									</RadioGroup>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='mobile'
						render={({ field }) => (
							<FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
								<FormControl>
									<Checkbox checked={field.value} onCheckedChange={field.onChange} />
								</FormControl>
								<div className='space-y-1 leading-none'>
									<FormLabel>Use different settings for my mobile devices</FormLabel>
									<FormDescription>You can manage your mobile notifications</FormDescription>
								</div>
							</FormItem>
						)}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
		</div>
	)
}
