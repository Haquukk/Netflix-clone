import { fetchFromTMDB } from "../services/tmdb.service.js";
import { User } from "../models/user.model.js";

export const searchPerson = async (req, res) => {
  const { query } = req.params;

  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/person?query=${query}&include_adult=false&language=en-US&page=1`
    );

    if (response.length === 0) return res.status(404).send(null);

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searcHistory: {
          id: response.result[0].id,
          image: response.result[0].profile.path,
          title: response.result[0].name,
          searchType: "person",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ content: response.results });
  } catch (error) {
    console.log("Error in searchPerson controller: ", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const searchMovie = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=1`
    );

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.result[0].id,
          image: response.result[0].poster.path,
          title: response.result[0].title,
          searchType: "movie",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ content: response.results });
  } catch (error) {
    console.log("Error in searchMovie: ", error.message);
    res.status(500).json({ error: "Internal Sever Error" });
  }
};

export const searchTv = async (req, res) => {
  const { query } = req.params;
  try {
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/tv?query=${query}&include_adult=false&language=en-US&page=1`
    );

    await User.findByIdAndUpdate(req.user._id, {
      $push: {
        searchHistory: {
          id: response.result[0].id,
          image: response.result[0].poster.path,
          title: response.result[0].name,
          searchType: "tv",
          createdAt: new Date(),
        },
      },
    });

    res.status(200).json({ content: response.results });
  } catch (error) {
    console.log("Error in searchTVs: ", error.message);
    res.status(500).json({ error: "Internal Sever Error" });
  }
};

export const getSearchHistory = async (req, res) => {
  try {
    res.status(200).json({ content: req.user.searcHistory });
  } catch (error) {
    res.status(500).json({ error: "Internal Sever Error" });
  }
};

export const removeItemFromSearchHistory = async (req, res) => {
  let { id } = req.params;

  id = parseInt(id);

  try {
    await User.findByIdAndUpdate(id, {
      $pull: {
        searchHistory: { id: id },
      },
    });
  } catch (error) {
    console.log("Error remove searchHistory : ", error.message);
    res.status(500).json({ error: "Internal Sever Error" });
  }
};
