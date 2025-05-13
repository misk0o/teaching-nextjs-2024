"use client";

import { useForm } from "react-hook-form";
import { createMarketplace } from "./create-marketplace-action";

type FormValues = {
  name: string;
  description: string;
  price: string;
  condition: string;
  photoUrls: string[];
};

export function NewMarketplaceForm() {
  const { register, watch, setValue, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      photoUrls: [],
      condition: "new",
    },
  });

  const photoUrls = watch("photoUrls");

  return (
    <form
      className="grid grid-cols-1"
      onSubmit={handleSubmit((data) => {
        createMarketplace(
          data.name,
          data.description,
          parseFloat(data.price),
          "car",
          data.photoUrls,
          data.condition
        );
      })}
    >
      <input
        className="input input-bordered"
        placeholder="Name"
        {...register("name")}
      />
      <textarea
        {...register("description")}
        className="textarea textarea-bordered"
        placeholder="Description ..."
      ></textarea>
      <input
        className="input input-bordered"
        type="number"
        placeholder="Price"
        {...register("price")}
      />
      <select className="select select-bordered" {...register("condition")}>
        <option value="new">New</option>
        <option value="used">Used</option>
        <option value="like_new">Like New</option>
        <option value="unused">Unused</option>
      </select>
      <span>Photo urls</span>
      {photoUrls.map((photoUrl, index) => (
        <div key={index}>
          <input
            className="input input-bordered"
            placeholder="Photo url"
            value={photoUrl}
            onChange={(e) => {
              photoUrls[index] = e.target.value;
              setValue("photoUrls", photoUrls);
            }}
          />
          {photoUrl !== "" ? <img src={photoUrl} /> : null}
          <button
            className="btn btn-xs"
            onClick={(e) => {
              e.preventDefault();
              setValue(
                "photoUrls",
                photoUrls.slice(0, index).concat(photoUrls.slice(index + 1))
              );
            }}
          >
            X
          </button>
        </div>
      ))}
      <button
        className="btn btn-xs"
        onClick={(e) => {
          e.preventDefault();
          setValue("photoUrls", photoUrls.concat([""]));
        }}
      >
        Add photo
      </button>
      <input className="btn btn-sm btn-outline" type="submit" value="Create" />
    </form>
  );
}
