
#Image Recognition as a Serivce(IRaaS)



###Usage:
It may seem like a daunting task teaching a small peace of hardware to identify objects in the real world.
This is why I don't intend to try and teach it to identify everything. That is a sure path to failure.
Instead we can make it much simpiler with the two following stratigies.

###Use it as a Frame of Reference:
Augmented reality apps are often jumpy because they use the cameras gyroscope and compus to determine where things go on the screen.
Those two sensors are often slightly delayed and fast movments create momentum that throw them off.

What if instead every frame rendered on the screen was analized and we used the previous frames visual orientation data to render the current frame.
Think of it like your videos camera's anti-shake mechnisim on sterioides. Instead of thinking of each frame as a 2d image that shifts all renedered objects close and far at the same ratio
  we would need to identify horizions off in the distance, clusters of

For this to work we would need to determine various objects the distance from the device. This can easily be done using the method described below in the section titled **Distance Tracking with two or more cameras**.

With this technology we can render more complex interfaces with far more accuracy then we could previously. Instead of the jumpy pin overlayed onto your screen to indicate your favorite coffee shop we can outline/highlight an entire building. We examine this later in the **Navigation Example**.


###As and identifier for a small group of predetermined objects:
Part of the problem right now is accuracy of the wearables. GPS Inside a building is not that accurate and bluetooth technologies only go so far. Imagine sitting in bed trying to switch off your bedroom light using a HUD and for some reason the kitchen fan menu keeps poping up. This is a problem with accuracy.
We could solve this by using image recognition to identify which object controls which device and theirfore which menu to display on your wearable.
Instead of trying to get IRaaS to memorize every possible object in the world we could teach it to identify only a few key object such as the lights in your family room, the kitchen fan, and your garadge door.
We could make it simplier by associating a unique symbol with each one of these devices. Think of a really basic QR code.
Again we could make it simpiler by making that symbol a unique color or set of colors.
Finally since I doubt anyone besides tech nerds want to put colorful QR code stickers above every wired in outlet in their house we should probablly find a way to incoporate pretty designs for each one.
So your kids room could have a green and purple dinosore lightswitch cover and your kitchen light switch could be a black pan with red strips of bacon.

Now instead of needing to identify every possible combination of pixels to identify these outlets your device would be looking for a small hand full of colorful symbols and only when your in your home. The logic would go as follows:

1. Are you in your home? - Is your home WiFi network in Range?
2. What are the unique symbols that can be expected at home? What colors should we be looking for?
3. Does live image from your wearable have the proper combinations of colors?
4. If so only then do we try and match it to the symbol and only the pixels that match the two colors(this save us lots of processing time).



###Caching and Cloud:
Using the above example with home lightswitches.

###Distance Tracking with two or more cameras:
This is a peace of cake when using two or more cameras. It is a simple triangulation(yes, not trilateration this time) formula.
Assume we have a camera on each side of your glasses and we know the exact distance from camera A and B. They also are mounted 100% parrellel from each other.

###Hands and Gestures:
Since we know the frame of reference is pretty much always a first person perspective and

Imagine you could turn pretty much any surface into a virtual key board just by looking at it.




###Genetic Learning Algoryhtems:


###Croud Source Learning:


###Navigation Example:
Lets examine the building example more. The building example is one potential application that could be built off of IRaaS.
Assuming I can hack the 3d model of the building and the buildings surrounding it out of google earth this should be relitivly simple.

1. Have the user enter in a destination.
2. Get the users location via GPS to give us a rough idea where they are
3. Grab the areas 3d google map building data
4. Attempt to render the building according to the users vantage points creating an assumed 2d prespective
5. Run the clustering algorythem on the users actual frame of reference and try and determine which building match up with the rendered 2d
6. If we find a part of the image that matches with the 3d bulding data then highlight the pixels and render it on screen.