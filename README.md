# music-organizer
The `music-copy` script now does the following:

- Prompts the user to enter the paths to their music library and the directory where they want to organize their music.
- Reads all the JSON files in the ./music directory.
- For each JSON file:
- Creates a new folder in the user-specified directory with the same name as the JSON file.
- If a missing-songs.json file exists in the new folder, reads the list of songs from this file. Otherwise, reads the list of songs - from the JSON file.
- For each song in the list:
- Tries to find a matching .mp3 file in the user-specified music library.
- If a matching file is found, copies it to the newly created folder and adds it to a playlist.
- If no matching file is found, adds the song name to a list of missing songs.
- Writes any missing songs to a missing-songs.json file in the newly created folder.
- Writes the playlist to a folder.m3u8 file in the newly created folder.