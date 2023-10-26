const fs = require('fs');
const path = require('path');
const util = require('util');
const readline = require('readline');
const readdir = util.promisify(fs.readdir);
const copyFile = util.promisify(fs.copyFile);

const separateLine = '==================================================';

async function generateMusicFolders() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const musicJsonPath = path.join(__dirname, '../music');

  const musicLibraryPath = await new Promise((resolve) => {
    rl.question('Please enter the path to your music library: ', resolve);
  });

  const organizePath = await new Promise((resolve) => {
    rl.question('Please enter the path where you want to organize your music: ', resolve);
  });

  rl.close();

  const jsonFiles = fs.readdirSync(musicJsonPath);

  for (const file of jsonFiles) {
    if (path.extname(file) === '.json') {
      const musicCategory = path.basename(file, '.json');
      const musicFolderPath = path.join(organizePath, musicCategory);
      if (!fs.existsSync(musicFolderPath)) {
        fs.mkdirSync(musicFolderPath);
        console.log('\x1b[36m%s\x1b[0m',musicCategory, ' created!');
        console.log(separateLine);
      }

      let musicList;
      const missingSongsPath = path.join(musicFolderPath, 'missing-songs.json');
      if (fs.existsSync(missingSongsPath)) {
        musicList = JSON.parse(fs.readFileSync(missingSongsPath));
        console.log('\x1b[36m%s\x1b[0m',musicCategory, ' missing file found!');
      } else {
        musicList = require(path.join(musicJsonPath, file));
        console.log('\x1b[36m%s\x1b[0m',musicCategory, ' read from JSON!');
      }

      const missingSongs = [];
      const playlist = [];

      for (const song of musicList) {
        const songName = typeof song === 'string' ? song : song.name;
        const songFile = await findSongFile(songName, musicLibraryPath);

        if (songFile) {
          const destinationPath = path.join(musicFolderPath, path.basename(songFile));
          await copyFile(songFile, destinationPath);
          console.log(songName, ' copied!');
          playlist.push(path.basename(songFile));
        } else {
          missingSongs.push(songName);
          console.log('\x1b[31m%s\x1b[0m',songName, ' missed!');
        }
      }

      fs.writeFileSync(missingSongsPath, JSON.stringify(missingSongs));
      fs.writeFileSync(path.join(musicFolderPath, musicCategory + '.m3u8'), playlist.join('\n'));
    }
  }
}

async function findSongFile(songName, directory) {
  const files = await readdir(directory, { withFileTypes: true });

  for (const file of files) {
    if (file.isDirectory()) {
      const songFile = await findSongFile(songName, path.join(directory, file.name));
      if (songFile) return songFile;
    } else if (file.isFile() && file.name.includes(songName)) {
      return path.join(directory, file.name);
    }
  }

  return null;
}

generateMusicFolders().catch(console.error);