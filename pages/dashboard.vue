<script type="ts" setup>
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
</script>
<template>
	<MainHeader />
	<div class="flex flex-col w-full h-fit px-4 pt-6">
		<Tabs default-value="Overview">
			<TabsList>
				<TabsTrigger value="Overview"> Overview </TabsTrigger>
				<TabsTrigger value="Analytics"> Analytics </TabsTrigger>
				<TabsTrigger value="Reports"> Reports </TabsTrigger>
				<TabsTrigger value="Notifications"> Notifications </TabsTrigger>
			</TabsList>
			<TabsContent value="Overview">
				<PagesOverviewContent />
			</TabsContent>
			<TabsContent value="Analytics"> Change your password here. </TabsContent>
			<TabsContent value="Reports"> View your reports here. </TabsContent>
			<TabsContent value="Notifications">
				Manage your notifications here.
			</TabsContent>
		</Tabs>
	</div>
</template>
