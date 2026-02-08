import * as z from "zod";
import { useForm } from "@tanstack/react-form";
import { toast } from "sonner";
import { useUpdateSettings } from "../hooks";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  http_proxy: z
    .string()
    .refine((v) => !v || /^https?:\/\//.test(v), { message: "Invalid URL" }),
  soundcloud_oauth: z
    .string()
    .min(39, { error: "OAuth Should Be 39 Characters Not Less" })
    .max(39, { error: "OAuth Should Be 39 Characters Not More" })
    .nonoptional({ error: "This Field Is Required" }),
  concurrent_downloads: z
    .number()
    .min(1, { error: "The Minimum Is 1" })
    .max(25, { error: "The Maximum Is 25" })
    .default(4)
    .nonoptional({ error: "This Field Is Required" }),
  concurrent_fragment_downloads: z
    .number()
    .min(1, { error: "The Minimum Is 1" })
    .max(12, { error: "The Maximum Is 12" })
    .default(4)
    .nonoptional({ error: "This Field Is Required" }),
  download_retries: z
    .number()
    .min(1, { error: "The Minimum Is 1" })
    .max(20, { error: "The Maximum Is 20" })
    .default(4)
    .nonoptional({ error: "This Field Is Required" }),
  sync_interval: z
    .number()
    .min(1, { error: "The Minimum Is 1 Minutes" })
    .max(1440, { error: "The Maximum Is 1,440 Minutes" })
    .default(4)
    .nonoptional({ error: "This Field Is Required" }),
});

export function SettingsForm({
  soundcloud_oauth,
  http_proxy,
  concurrent_downloads,
  concurrent_fragment_downloads,
  download_retries,
  sync_interval,
}: {
  soundcloud_oauth: string;
  http_proxy: string;
  concurrent_downloads: number;
  concurrent_fragment_downloads: number;
  download_retries: number;
  sync_interval: number;
}) {
  const mutation = useUpdateSettings();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      soundcloud_oauth: soundcloud_oauth,
      http_proxy: http_proxy,
      concurrent_downloads: concurrent_downloads,
      concurrent_fragment_downloads: concurrent_fragment_downloads,
      download_retries: download_retries,
      sync_interval: sync_interval,
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutation.mutate(value, {
        onSuccess: () => {
          toast.success("Settings Updated Successfully", {
            position: "top-right",
          });
          queryClient.invalidateQueries({ queryKey: ["settings"] });
        },
        onError: () => {
          toast.error("Issue During Updating Settings", {
            position: "top-right",
          });
        },
      });
    },
  });

  return (
    <Card className="w-full ">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          id="settings-form"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="w-[40%] flex flex-col gap-5"
        >
          <form.Field
            name="soundcloud_oauth"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>OAuth SoundCloud</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}

                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="OAuth x-xxxxxx-xxxxxxxxx-xxxxxxxxxxxxxx"
                    type="password"
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>Your OAuth SoundCloud</FieldDescription>
                </Field>
              );
            }}
          />
          <form.Field
            name="http_proxy"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>Http Proxy</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder="http://... (Optional)"
                    type="url"
                    aria-invalid={isInvalid}
                  />
                  <FieldDescription>
                    Http proxy to request to Soundcloud
                  </FieldDescription>
                </Field>
              );
            }}
          />
          <form.Field
            name="concurrent_downloads"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>Concurrent Downloads</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}

                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    aria-invalid={isInvalid}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  <FieldDescription>
                    Total musics to download at same time
                  </FieldDescription>
                </Field>
              );
            }}
          />
          <form.Field
            name="concurrent_fragment_downloads"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>Concurrent Fragment Downloads</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}

                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    aria-invalid={isInvalid}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  <FieldDescription>
                    Total fragments of music to download at same time
                  </FieldDescription>
                </Field>
              );
            }}
          />
          <form.Field
            name="download_retries"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>Retry Downloads</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}

                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    aria-invalid={isInvalid}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  <FieldDescription>
                    Total retry to download the music
                  </FieldDescription>
                </Field>
              );
            }}
          />
          <form.Field
            name="sync_interval"
            children={(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field>
                  <FieldLabel>Sync Interval</FieldLabel>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}

                  <Input
                    type="number"
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    aria-invalid={isInvalid}
                    onChange={(e) => field.handleChange(e.target.valueAsNumber)}
                  />
                  <FieldDescription>
                    Sync Playlists and Tracks at fixed Intervals
                  </FieldDescription>
                </Field>
              );
            }}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="settings-form">
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
