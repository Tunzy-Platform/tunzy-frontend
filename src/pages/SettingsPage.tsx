import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SettingsForm } from "@/features/settings/components/SettingsForm";
import { useFetchSettings } from "@/features/settings/hooks";
import { isSettingComplete } from "@/features/settings/utils";
import { AlertCircleIcon } from "lucide-react";

export function SettingsPage() {
  const { data, isLoading } = useFetchSettings();
  if (isLoading || !data) {
    return <>loading settings ....</>;
  }

  return (
    <div className="flex justify-center flex-col gap-5 ">
      {!data ||
        (!isSettingComplete(data) && (
          <Alert variant="destructive" className="max-w-md self-center">
            <AlertCircleIcon />
            <AlertTitle>Complete Settings</AlertTitle>
            <AlertDescription>
              Before Using The Platform Complete The Settings
            </AlertDescription>
          </Alert>
        ))}
      <div className="flex justify-center">
        <div className="w-full max-w-4xl">
          <SettingsForm
            soundcloud_oauth={data?.soundcloud_oauth}
            http_proxy={data?.http_proxy}
            download_retries={data?.download_retries}
            concurrent_downloads={data?.concurrent_downloads}
            concurrent_fragment_downloads={data?.concurrent_fragment_downloads}
          />
        </div>
      </div>
    </div>
  );
}
