Thank you for the interview opportunity. This is a simple project with 3 files.

Public URL
https://cdn.rawgit.com/brookswift/slackLightbox/7b501c35/lightbox.html

Project Summary
lightbox.js contains a lightbox module with some application constants and the
instantiation of the application. The application will initially load 72 thumbnails
of kittens in a 4 wide column with a search bar at the top for browsing other images.
Hovering a thumbnail will slightly zoom in on it to highlight it, and clicking will
open a modal overlay with a larger version of the image as well as its title. There
are forward and back buttons to navigate through the pictures while in the detail view.
clicking anywhere but the forward and back buttons will close the detail view and return
you to the thumbnail view.

User Experience
The search form uses default browser form handling, so the expected keyboard behaviors,
like submitting the form with the enter key still work. There is subtle animation that
smooths out the experience of transitioning between views and also serves to highlight
the current mouse position over a thumbnail. Currently, as the page loads, thumbnails
will load as available for quicker responsiveness. The layout space is held open by the
stylesheet. As implementing graphics was beyond the scope of this project, I did not add
a loading state spinner. Default link highlighting is maintained on focus and active states
for usability support.

Error handling
Server Errors are handled with verification of the request status as well as the flickr
API status. Errors in either case will be displayed to the user below the search box.
I noticed that there are some images that load blank from the flickr api. I could
possibly try to detect those broken images and remove them from the interface in future
revisions. The issue seems to be that sometimes a particular image size is not available
and I will be served a blank image instead. When a title is not provided for an image,
I just let it display as blank, as I saw no need to handle that case from the user
perspective. I am not handling data integrity errors from the flickr api, as I trust
their api to enforce its own quality control, and if I doubted it, I would want to
use more specific tools to verify their API.

Future optimizations
Since this was a small test project, I didn't go through putting together a more
generic template renderer or go through tracking image loading and putting in loading
screens, as this is a vanillaJS project, I'd have to write some extra libraries to do
that easily. I also did not include A11y support because I am unsure of the utility of
an image viewer for a blind user without access to additional image metadata, which is
beyond the scope of this project. I'd also ideally use more separation between needs
in the architecture, but with a small project, breaking up the project into more services
and files would only serve to complicate matters. I did not implement any build tools
to maintain the simplicity of the project, but I could see

Security
I know that I shouldn't be posting a dev key to a public github, so I generated a dev
key on a throwaway account, and I will be removing my repo when the interview is complete.
Without a server proxy set up, I can't hide my auth key, and setting up a server proxy
is beyond the scope of this project, but ideally, the api key would live on the server
and I would just access the flickr api via proxy so as not to expose my key to the
web client.
