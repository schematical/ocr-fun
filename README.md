
#Image Recognition as a Service(IRaaS)



##Basic Usage:
It may seem like a daunting task teaching a small piece of hardware to identify objects in the real world.
This is why I don't intend to try and teach it to identify everything. That is a sure path to failure.
Instead we can make it much simpler with the two following strategies.

###Use it as a Frame of Reference:
Augmented reality apps are often jumpy because they use the cameras gyroscope and compass to determine where things go on the screen.
Those two sensors are often slightly delayed and fast movements create momentum that throw them off.

What if instead every frame rendered on the screen was analyzed and we used the previous frames visual orientation data to render the current frame.
Think of it like your videos camera's anti-shake mechanism on steroids. Instead of thinking of each frame as a 2d image that shifts all rendered objects close and far at the same ratio
  we would need to identify horizons off in the distance, clusters of

For this to work we would need to determine various objects the distance from the device. This can easily be done using the method described below in the section titled **Distance Tracking with two or more cameras**.

With this technology we can render more complex interfaces with far more accuracy then we could previously. Instead of the jumpy pin overlayed onto your screen to indicate your favorite coffee shop we can outline/highlight an entire building. We examine this later in the **Navigation Example**.


###As an identifier for a small group of predetermined objects:
Part of the problem right now is accuracy of the wearables. GPS Inside a building is not that accurate and bluetooth technologies only go so far. Imagine sitting in bed trying to switch off your bedroom light using a HUD and for some reason the kitchen fan menu keeps popping up. This is a problem with accuracy.
We could solve this by using image recognition to identify which object controls which device and therefore which menu to display on your wearable.
Instead of trying to get IRaaS to memorize every possible object in the world we could teach it to identify only a few key object such as the lights in your family room, the kitchen fan, and your garage door.
We could make it simpler by associating a unique symbol with each one of these devices. Think of a really basic QR code.
Again we could make it simpler by making that symbol a unique color or set of colors.
Finally since I doubt anyone besides tech nerds want to put colorful QR code stickers above every wired in outlet in their house we should probably find a way to incorporate pretty designs for each one.
So your kids room could have a green and purple dinosaur light switch cover and your kitchen light switch could be a black pan with red strips of bacon.

Now instead of needing to identify every possible combination of pixels to identify these outlets your device would be looking for a small hand full of colorful symbols and only when your in your home. The logic would go as follows:

1. Are you in your home? - Is your home WiFi network in Range?
2. What are the unique symbols that can be expected at home? What colors should we be looking for?
3. Does live image from your wearable have the proper combinations of colors?
4. If so only then do we try and match it to the symbol and only the pixels that match the two colors(this save us lots of processing time).


##Technical Notes:
###Image Recognition Basics:
Just so you can follow along Image Recognition as I have applied it is a two step process.

####Clustering:
First we start by grouping pixels together into clusters. So if we see a blob of pixel near each other that are all variations of red then we create a **cluster**

####Edge Comparison:
Once we have our clusters we need to figure out what **symbol** saved in memory the cluster is most similar to.

Often times you will never find a perfect match, you just need to find the most likely symbol beyond a reasonable doubt.

####The Magic/Frame of Reference:
Adding a little logic can go a long way. For example if we know the following about the first symbol:

* It is the letter A
* It is 45 degrees rotated from horizontal
* It is scaled 55% smaller than the symbol in memory
* It is Times new Roman font
* It is blue

Then we maybe able to speed up our process of elimination by
* testing all blue clusters first
* rotating blue clusters by 45 degrees before testing them
* scaling all blue clusters by 55% before testing them
* testing them against our memory symbols for letters in the Times New Roman font

If none of these work then we must proceed back to the less efficient brute force method but more than likely this intelligence will speed up the process drastically.


####Cluster Groups:
Sometimes images and objects are made up of much more than just one color or symbol. Faces for example have many shapes. In order to test these more complex objects we will need to compensate for complex cluster groups.


###Caching and Cloud:
Using the above example with home light switches we would only need the wearable to identify a limited number of symbols/objects. Just the ones with in range.

So if you are in your house you would just need to remember the symbols you have linked to device controls. Those would be stored in the locally on the devices memory as a short list of objects/symbols to be on the lookout for.

If there was a symbol that the App on the local device didn't understand then it could send the cluster out to the cloud servers to identify. The cloud servers would return the results which the App running locally could use then choose to cache or not.

###Android Style Intents:
Each app would most likely have a list of symbols stored on the device that the app would always passively be looking for. Think of these like **Android Intents**. Android allows an app to listen for different actions like for example trying to message a contact from your contacts list.
Then it looks at all of your apps and says figures out which one has a messaging feature. It then displays a list of the apps with messaging capability that you can then chose from.

It would be a bit different here though. Each app would have a list of symbols to be on the look out for. When IRaaS sees that the wearable is focused on an object that matches that symbol it would fire off the App and trigger the intent.
The intent might just render a small on screen menu like in our light switch example.

###Public vs Private Symbols:


###Disqualifying Rules/Processing Improvements:
Each **Symbol** would not only be made up of an image but most likely a set of disqualifying rules. This would help processing speed by allowing IRaaS to quickly disqualify an object's potential match.
For example if you are looking for the purple dinosaur and there is not any recognizable purple pixel clusters don't bother trying to test the dinosaur symbol.


###Distance Tracking with two or more cameras:
This is a piece of cake when using two or more cameras. It is a simple triangulation(yes, not trilateration this time) formula.
Assume we have a camera on each side of your glasses and we know the exact distance from camera A and B. They also are mounted 100% parallel from each other.

###Hands and Gestures:
Since we know the frame of reference is pretty much always a first person perspective. Their fore we can assume that stretching outward from our point of view there will be two skin toned pixel clusters with five wiggly things sticking out of them(our hands).
So we can always be passively monitoring what these are doing.

Or perhaps not always. Perhaps we could establishing that the Wearable AR Device should be listening by holding up both hands in a gesture that triggers the hand monitoring.

Imagine you could turn pretty much any surface into a virtual key board just by looking at it and placing your hands on it in a certain gesture.

##Examples:
###Navigation Example:
Lets examine the building example more. The building example is one potential application that could be built off of IRaaS.
Assuming I can hack the 3d model of the building and the buildings surrounding it out of google earth this should be relatively simple.

1. Have the user enter in a destination.
2. Get the user's location via GPS to give us a rough idea where they are
3. Grab the areas 3d google map building data
4. Attempt to render the building according to the users vantage points creating an assumed 2d perspective
5. Run the clustering algorithm on the users actual frame of reference and try and determine which building matchup with the rendered 2d
6. If we find a part of the image that matches with the 3d building data then highlight the pixels and render it on screen.

##Business Model:
###Premium:
I could see it going a couple of ways:

* Pay per symbol identified(prob less than or equal to one cent per symbol)
* Per user/app installation
* Flat fee

###Free Service:
We could increase adoption of the service by offering IRaaS for free but installing an app that allows sponsors and advertisers to register their logo's as symbols. This means that any time someone using an App using IRaaS's free service walked down the cereal aisle at the grocery store then a little box would pop up highlighting the sponsored cereal.


##Beyond the basics:
The two strategies I outlined earlier were simple ways to efficiently start using Image Recognition to help Augment Reality. Eventually we may want to do more. Below are some ways we might start the process of evolving IRaaS's capabilities.

###Genetic Learning Algorithms:
Previously my project titled the [Fish Tank](github.com/schematical/fish_tank) explored the concept of genetic machine learning.
The concepts covered there are far beyond what I have time to discuss here so I will keep this part simple.
Basically we can use brute force machine learning to create symbols and disqualifying rules that are far more comprehensive than if we were to write them by hand, and much quicker as well.

###Crowd Source Learning:
We could supplement my genetic learning algorithms with by crowd sourcing identifying the objects in an image. How would we do this?
Simple, we already are. People are tagging images all day every day. Facebook started identifying peoples faces in images and now have Facial Recognition technology that learned from the users tags. Flicker, Twitter, Google images all are already doing it.
If nothing else I could write a bot that scans and learns on its own but it would probably be better to some how barter for the data from an existing data source.



