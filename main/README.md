# Meteor.js 3 + Vue3

This is a simple example of how to use Vue3 with Meteor.

## How to use

1. Clone this repo
2. Run `meteor npm install`
3. Run `meteor`
4. Open `http://localhost:3000` in your browser

## Libraries used

- [Vue3](https://v3.vuejs.org/)
- [Rspack](https://rspack.dev/)
- [Vue Router](https://next.router.vuejs.org/)
- [Meteor](https://www.meteor.com/)
- [Vue Meteor Tracker](https://github.com/meteor-vue/vue-meteor-tracker)
- [Tailwind CSS](https://tailwindcss.com/)

# Build manual

```bash
REMOTE_APP1_URL="http://<public-ip>:4000" meteor build --allow-superuser --directory <output-dir> --server-only


# Copy Dockerfile.build to bundle
cp Dockerfile.build <output-dir>/bundle/Dockerfile.build

# Build bundle image
docker build --build-arg REMOTE_APP1_URL="http://[IP_ADDRESS]" --platform linux/amd64 -t rnavy/multi-app:main-host <output-dir>/bundle/

# Push to docker hub
docker push rnavy/multi-app:main-host
```

## Example

```bash

REMOTE_APP1_URL="http://192.168.0.220:4000" meteor build --allow-superuser --directory ~/Desktop/App/build/main/ --server-only
cp Dockerfile.build ~/Desktop/App/build/main/bundle/Dockerfile
docker build --build-arg REMOTE_APP1_URL="http://192.168.0.220:4000" --platform linux/amd64 -t rnavy/multi-app:main-app-host ~/Desktop/App/build/main/bundle/
docker push rnavy/multi-app:main-app-host
```
