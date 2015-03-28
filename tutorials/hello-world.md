---
layout: subpage
id: tutorial-hello-world
parent: tutorials
permalink: /tutorials/hello-world/
order: 2

title: "Hello world"
---
## Hello world application
In this tutorial we will create simple fragment which uses view that prints Hello world.

You can take look at [final result](http://repo.meta-platform.com/metajs/examples/hello-world/).

### Create project
At first, create project directory and move to it.

```
mkdir hello-world
cd hello-world
```

Clone MetaJS repository or put minified version to `metajs/dist` subdirectory.

```
git clone https://github.com/metaplatform/metajs.git
```

Create `index.html` file.

```html
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>MetaJS Simple To-do app</title>

		<script type="text/javascript" src="metajs/dist/metajs.min.js"></script>
	</head>

	<body>

		...

	</body>
</html>
```

### Fragment view
Now lets define our fragment view. Adds following HTML to body instead of dots.

```html
<template is="meta-view" name="com.example.hello">

	<p>Hello world!</p>

</template>
```

We just created simple view with template that contains one paragraph.

View is defined by native **template** tag and extended to meta-view by settings **is** attribute to **meta-view**.

Attribute **name** specifies global view name so we can reference it later in our fragment definition.

### Fragment definition
Now we will define our fragment. Add following code after view definition.

```html
<script type="text/javascript">
	Meta.Fragment("com.example.hello", {

		view: "com.example.hello"

	});
</script>
```

Code registers new fragment **com.example.hello** and we specified that fragment should use **com.example.hello** view as we defined previously.

First argument of Meta.Fragment function specifies global fragment name so it can be created later.

### Create fragment
Until now we didn't see anything because we just registered fragment but not created it.

So let's add following code at the end of our index before `</body>`.

```html
<meta-fragment name="com.example.hello" auto></meta-fragment>
```

We simply added Fragment with name **com.example.hello** to our page.

Attribute `auto` means that fragment should be automatically resumed (started) so we don't have to do it manually.

**That's it!**

### Full source code
```html
<!doctype html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>MetaJS Simple To-do app</title>

		<script type="text/javascript" src="metajs/dist/metajs.min.js"></script>
	</head>

	<body>

		<template is="meta-view" name="com.example.hello">

			<p>Hello world!</p>

		</template>

		<script type="text/javascript">
			Meta.Fragment("com.example.hello", {

				view: "com.example.hello"

			});
		</script>

		<meta-fragment name="com.example.hello" auto></meta-fragment>
		
	</body>
</html>
```